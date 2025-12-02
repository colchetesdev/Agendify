import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledServicesController } from '../scheduled-services.controller';
import { ScheduledServicesService } from '../scheduled-services.service';
import { CreateScheduledServiceDto } from '../dto/create-scheduled-service.dto';
import { UpdateScheduledServiceDto } from '../dto/update-scheduled-service.dto';
import { ScheduledService } from '../entities/scheduled-service.entity';
import { ScheduledServiceBuilder } from './scheduled-services.builder';
import { ServiceBuilder } from '../../services/__tests__/service.builder';

describe('ScheduledServicesController', () => {
  let controller: ScheduledServicesController;
  let service: ScheduledServicesService;

  const mockScheduledServicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledServicesController],
      providers: [
        {
          provide: ScheduledServicesService,
          useValue: mockScheduledServicesService,
        },
      ],
    }).compile();

    controller = module.get<ScheduledServicesController>(ScheduledServicesController);
    service = module.get<ScheduledServicesService>(ScheduledServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a scheduled service', async () => {
      const service = new ServiceBuilder().withId(1).withName('Haircut').build();
      const createDto: CreateScheduledServiceDto = new ScheduledServiceBuilder()
        .withService(service)
        .buildCreateDto(1);

      const expectedResult: ScheduledService = new ScheduledServiceBuilder()
        .withId(1)
        .withService(service)
        .build();

      mockScheduledServicesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(mockScheduledServicesService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of scheduled services', async () => {
      const expectedResult: ScheduledService[] = [
        new ScheduledServiceBuilder().withId(1).build(),
      ];

      mockScheduledServicesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockScheduledServicesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single scheduled service', async () => {
      const expectedResult: ScheduledService = new ScheduledServiceBuilder().withId(1).build();

      mockScheduledServicesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(mockScheduledServicesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a scheduled service', async () => {
      const updateDto: UpdateScheduledServiceDto = {
        clientName: 'Jane Doe',
        scheduledHour: '15:00',
      };

      const expectedResult: ScheduledService = new ScheduledServiceBuilder()
        .withId(1)
        .withClientName('Jane Doe')
        .withScheduledHour('15:00')
        .build();

      mockScheduledServicesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateDto);

      expect(mockScheduledServicesService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a scheduled service', async () => {
      mockScheduledServicesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(mockScheduledServicesService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
