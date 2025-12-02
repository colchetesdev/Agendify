import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduledServiceDto } from './dto/create-scheduled-service.dto';
import { UpdateScheduledServiceDto } from './dto/update-scheduled-service.dto';
import { ScheduledService } from './entities/scheduled-service.entity';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class ScheduledServicesService {
  constructor(
    @InjectRepository(ScheduledService)
    private readonly scheduledServiceRepository: Repository<ScheduledService>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createScheduledServiceDto: CreateScheduledServiceDto): Promise<ScheduledService> {
    const service = await this.serviceRepository.findOne({
      where: { id: createScheduledServiceDto.serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${createScheduledServiceDto.serviceId} not found`);
    }

    const scheduledService = this.scheduledServiceRepository.create({
      ...createScheduledServiceDto,
      service,
    });

    return await this.scheduledServiceRepository.save(scheduledService);
  }

  async findAll(page = 1, limit = 10): Promise<{
    data: ScheduledService[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.scheduledServiceRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'DESC' },
      relations: ['service'],
    });

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<ScheduledService> {
    const scheduledService = await this.scheduledServiceRepository.findOne({
      where: { id },
      relations: ['service'],
    });

    if (!scheduledService) {
      throw new NotFoundException(`ScheduledService with ID ${id} not found`);
    }

    return scheduledService;
  }

  async update(id: number, updateScheduledServiceDto: UpdateScheduledServiceDto): Promise<ScheduledService> {
    const scheduledService = await this.findOne(id);

    if (updateScheduledServiceDto.serviceId) {
      const service = await this.serviceRepository.findOne({
        where: { id: updateScheduledServiceDto.serviceId },
      });

      if (!service) {
        throw new NotFoundException(`Service with ID ${updateScheduledServiceDto.serviceId} not found`);
      }

      scheduledService.service = service;
    }

    Object.assign(scheduledService, updateScheduledServiceDto);
    return await this.scheduledServiceRepository.save(scheduledService);
  }

  async remove(id: number): Promise<void> {
    const scheduledService = await this.findOne(id);
    await this.scheduledServiceRepository.remove(scheduledService);
  }
}
