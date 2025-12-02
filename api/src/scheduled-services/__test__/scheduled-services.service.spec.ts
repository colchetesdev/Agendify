import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ScheduledServicesService } from '../scheduled-services.service';
import { ScheduledService } from '../entities/scheduled-service.entity';
import { Service } from '../../services/entities/service.entity';
import { CreateScheduledServiceDto } from '../dto/create-scheduled-service.dto';
import { UpdateScheduledServiceDto } from '../dto/update-scheduled-service.dto';

describe('ScheduledServicesService', () => {
  let service: ScheduledServicesService;
  let scheduledServiceRepository: Repository<ScheduledService>;
  let serviceRepository: Repository<Service>;

  const mockScheduledServiceRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockServiceRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduledServicesService,
        {
          provide: getRepositoryToken(ScheduledService),
          useValue: mockScheduledServiceRepository,
        },
        {
          provide: getRepositoryToken(Service),
          useValue: mockServiceRepository,
        },
      ],
    }).compile();

    service = module.get<ScheduledServicesService>(ScheduledServicesService);
    scheduledServiceRepository = module.get<Repository<ScheduledService>>(
      getRepositoryToken(ScheduledService),
    );
    serviceRepository = module.get<Repository<Service>>(
      getRepositoryToken(Service),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new scheduled service', async () => {
      const createDto: CreateScheduledServiceDto = {
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '14:30',
        clientName: 'John Doe',
        clientPhone: '123-456-7890',
        serviceId: 1,
      };

      const mockService: Service = {
        id: 1,
        name: 'Haircut',
        durationTimeMinutes: 30,
        scheduledServices: [],
      };

      const mockScheduledService = {
        id: 1,
        serviceDate: createDto.serviceDate,
        scheduledHour: createDto.scheduledHour,
        clientName: createDto.clientName,
        clientPhone: createDto.clientPhone,
        service: mockService,
      };

      mockServiceRepository.findOne.mockResolvedValue(mockService);
      mockScheduledServiceRepository.create.mockReturnValue(mockScheduledService);
      mockScheduledServiceRepository.save.mockResolvedValue(mockScheduledService);

      const result = await service.create(createDto);

      expect(mockServiceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockScheduledServiceRepository.create).toHaveBeenCalledWith({
        ...createDto,
        service: mockService,
      });
      expect(mockScheduledServiceRepository.save).toHaveBeenCalledWith(mockScheduledService);
      expect(result).toEqual(mockScheduledService);
    });

    it('should throw NotFoundException when service not found', async () => {
      const createDto: CreateScheduledServiceDto = {
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '14:30',
        clientName: 'John Doe',
        clientPhone: '123-456-7890',
        serviceId: 999,
      };

      mockServiceRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createDto)).rejects.toThrow(
        'Service with ID 999 not found',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of scheduled services with relations', async () => {
      const mockServices = [
        {
          id: 1,
          serviceDate: new Date('2025-12-15'),
          scheduledHour: '14:30',
          clientName: 'John Doe',
          clientPhone: '123-456-7890',
          service: { id: 1, name: 'Haircut', durationTimeMinutes: 30 },
        },
      ];

      mockScheduledServiceRepository.find.mockResolvedValue(mockServices);

      const result = await service.findAll();

      expect(mockScheduledServiceRepository.find).toHaveBeenCalledWith({
        relations: ['service'],
      });
      expect(result).toEqual(mockServices);
    });
  });

  describe('findOne', () => {
    it('should return a scheduled service by id with relations', async () => {
      const mockScheduledService = {
        id: 1,
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '14:30',
        clientName: 'John Doe',
        clientPhone: '123-456-7890',
        service: { id: 1, name: 'Haircut', durationTimeMinutes: 30 },
      };

      mockScheduledServiceRepository.findOne.mockResolvedValue(mockScheduledService);

      const result = await service.findOne(1);

      expect(mockScheduledServiceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['service'],
      });
      expect(result).toEqual(mockScheduledService);
    });

    it('should throw NotFoundException when scheduled service not found', async () => {
      mockScheduledServiceRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'ScheduledService with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a scheduled service', async () => {
      const updateDto: UpdateScheduledServiceDto = {
        clientName: 'Jane Doe',
        scheduledHour: '15:00',
      };

      const existingScheduledService = {
        id: 1,
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '14:30',
        clientName: 'John Doe',
        clientPhone: '123-456-7890',
        service: { id: 1, name: 'Haircut', durationTimeMinutes: 30 },
      };

      const updatedScheduledService = {
        ...existingScheduledService,
        ...updateDto,
      };

      mockScheduledServiceRepository.findOne.mockResolvedValue(existingScheduledService);
      mockScheduledServiceRepository.save.mockResolvedValue(updatedScheduledService);

      const result = await service.update(1, updateDto);

      expect(mockScheduledServiceRepository.save).toHaveBeenCalled();
      expect(result.clientName).toBe('Jane Doe');
      expect(result.scheduledHour).toBe('15:00');
    });

    it('should update service relation when serviceId is provided', async () => {
      const updateDto: UpdateScheduledServiceDto = {
        serviceId: 2,
      };

      const existingScheduledService = {
        id: 1,
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '14:30',
        clientName: 'John Doe',
        clientPhone: '123-456-7890',
        service: { id: 1, name: 'Haircut', durationTimeMinutes: 30 },
      };

      const newService: Service = {
        id: 2,
        name: 'Beard Trim',
        durationTimeMinutes: 15,
        scheduledServices: [],
      };

      mockScheduledServiceRepository.findOne.mockResolvedValue(existingScheduledService);
      mockServiceRepository.findOne.mockResolvedValue(newService);
      mockScheduledServiceRepository.save.mockResolvedValue({
        ...existingScheduledService,
        service: newService,
      });

      const result = await service.update(1, updateDto);

      expect(mockServiceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
      });
      expect(result.service).toEqual(newService);
    });

    it('should throw NotFoundException when updating with invalid serviceId', async () => {
      const updateDto: UpdateScheduledServiceDto = {
        serviceId: 999,
      };

      const existingScheduledService = {
        id: 1,
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '14:30',
        clientName: 'John Doe',
        clientPhone: '123-456-7890',
        service: { id: 1, name: 'Haircut', durationTimeMinutes: 30 },
      };

      mockScheduledServiceRepository.findOne.mockResolvedValue(existingScheduledService);
      mockServiceRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
      await expect(service.update(1, updateDto)).rejects.toThrow(
        'Service with ID 999 not found',
      );
    });

    it('should throw NotFoundException when updating non-existent scheduled service', async () => {
      const updateDto: UpdateScheduledServiceDto = {
        clientName: 'Jane Doe',
      };

      mockScheduledServiceRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a scheduled service', async () => {
      const mockScheduledService = {
        id: 1,
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '14:30',
        clientName: 'John Doe',
        clientPhone: '123-456-7890',
        service: { id: 1, name: 'Haircut', durationTimeMinutes: 30 },
      };

      mockScheduledServiceRepository.findOne.mockResolvedValue(mockScheduledService);
      mockScheduledServiceRepository.remove.mockResolvedValue(mockScheduledService);

      await service.remove(1);

      expect(mockScheduledServiceRepository.remove).toHaveBeenCalledWith(
        mockScheduledService,
      );
    });

    it('should throw NotFoundException when removing non-existent scheduled service', async () => {
      mockScheduledServiceRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
