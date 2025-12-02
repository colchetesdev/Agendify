import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledServicesController } from '../scheduled-services.controller';
import { ScheduledServicesService } from '../scheduled-services.service';
import { CreateScheduledServiceDto } from '../dto/create-scheduled-service.dto';
import { UpdateScheduledServiceDto } from '../dto/update-scheduled-service.dto';
import { ScheduledService } from '../entities/scheduled-service.entity';

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
      const createDto: CreateScheduledServiceDto = {
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '14:30',
        clientName: 'John Doe',
        clientPhone: '123-456-7890',
        serviceId: 1,
      };

      const expectedResult: ScheduledService = {
        id: 1,
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '14:30',
        clientName: 'John Doe',
        clientPhone: '123-456-7890',
        service: {
          id: 1,
          name: 'Haircut',
          durationTimeMinutes: 30,
          scheduledServices: [],
        },
      };

      mockScheduledServicesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of scheduled services', async () => {
      const expectedResult: ScheduledService[] = [
        {
          id: 1,
          serviceDate: new Date('2025-12-15'),
          scheduledHour: '14:30',
          clientName: 'John Doe',
          clientPhone: '123-456-7890',
          service: {
            id: 1,
            name: 'Haircut',
            durationTimeMinutes: 30,
            scheduledServices: [],
          },
        },
      ];

      mockScheduledServicesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single scheduled service', async () => {
      const expectedResult: ScheduledService = {
        id: 1,
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '14:30',
        clientName: 'John Doe',
        clientPhone: '123-456-7890',
        service: {
          id: 1,
          name: 'Haircut',
          durationTimeMinutes: 30,
          scheduledServices: [],
        },
      };

      mockScheduledServicesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a scheduled service', async () => {
      const updateDto: UpdateScheduledServiceDto = {
        clientName: 'Jane Doe',
        scheduledHour: '15:00',
      };

      const expectedResult: ScheduledService = {
        id: 1,
        serviceDate: new Date('2025-12-15'),
        scheduledHour: '15:00',
        clientName: 'Jane Doe',
        clientPhone: '123-456-7890',
        service: {
          id: 1,
          name: 'Haircut',
          durationTimeMinutes: 30,
          scheduledServices: [],
        },
      };

      mockScheduledServicesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a scheduled service', async () => {
      mockScheduledServicesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
