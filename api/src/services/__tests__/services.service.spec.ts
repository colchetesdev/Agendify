import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ServicesService } from '../services.service';
import { Service } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';

describe('ServicesService', () => {
  let service: ServicesService;
  let repository: Repository<Service>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    repository = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Haircut',
        durationTimeMinutes: 30,
      };

      const mockService = {
        id: 1,
        ...createServiceDto,
      };

      mockRepository.create.mockReturnValue(mockService);
      mockRepository.save.mockResolvedValue(mockService);

      const result = await service.create(createServiceDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createServiceDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockService);
      expect(result).toEqual(mockService);
    });
  });

  describe('findAll', () => {
    it('should return paginated services', async () => {
      const mockServices = [
        { id: 1, name: 'Haircut', durationTimeMinutes: 30 },
        { id: 2, name: 'Beard Trim', durationTimeMinutes: 15 },
      ];

      mockRepository.findAndCount.mockResolvedValue([mockServices, 2]);

      const result = await service.findAll(1, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { id: 'DESC' },
      });
      expect(result).toEqual({
        data: mockServices,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a service by id', async () => {
      const mockService = { id: 1, name: 'Haircut', durationTimeMinutes: 30 };

      mockRepository.findOne.mockResolvedValue(mockService);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockService);
    });

    it('should throw NotFoundException when service not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Service with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const updateServiceDto: UpdateServiceDto = {
        name: 'Premium Haircut',
        durationTimeMinutes: 45,
      };

      const existingService = {
        id: 1,
        name: 'Haircut',
        durationTimeMinutes: 30,
      };
      const updatedService = { id: 1, ...updateServiceDto };

      mockRepository.findOne.mockResolvedValue(existingService);
      mockRepository.save.mockResolvedValue(updatedService);

      const result = await service.update(1, updateServiceDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedService);
    });

    it('should throw NotFoundException when updating non-existent service', async () => {
      const updateServiceDto: UpdateServiceDto = { name: 'Updated Service' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateServiceDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a service', async () => {
      const mockService = { id: 1, name: 'Haircut', durationTimeMinutes: 30 };

      mockRepository.findOne.mockResolvedValue(mockService);
      mockRepository.remove.mockResolvedValue(mockService);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockService);
    });

    it('should throw NotFoundException when removing non-existent service', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
