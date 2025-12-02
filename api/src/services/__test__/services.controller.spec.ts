import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from '../services.controller';
import { ServicesService } from '../services.service';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { Service } from '../entities/service.entity';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  const mockServicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a service', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Haircut',
        durationTimeMinutes: 30,
      };

      const expectedResult: Service = {
        id: 1,
        ...createServiceDto,
        scheduledServices: [],
      };

      mockServicesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createServiceDto);

      expect(service.create).toHaveBeenCalledWith(createServiceDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of services', async () => {
      const expectedResult: Service[] = [
        { id: 1, name: 'Haircut', durationTimeMinutes: 30, scheduledServices: [] },
        { id: 2, name: 'Beard Trim', durationTimeMinutes: 15, scheduledServices: [] },
      ];

      mockServicesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single service', async () => {
      const expectedResult: Service = {
        id: 1,
        name: 'Haircut',
        durationTimeMinutes: 30,
        scheduledServices: [],
      };

      mockServicesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const updateServiceDto: UpdateServiceDto = {
        name: 'Premium Haircut',
        durationTimeMinutes: 45,
      };

      const expectedResult: Service = {
        id: 1,
        name: 'Premium Haircut',
        durationTimeMinutes: 45,
        scheduledServices: [],
      };

      mockServicesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateServiceDto);

      expect(service.update).toHaveBeenCalledWith(1, updateServiceDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a service', async () => {
      mockServicesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
