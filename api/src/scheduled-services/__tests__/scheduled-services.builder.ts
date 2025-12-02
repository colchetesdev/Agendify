import { ScheduledService } from '../entities/scheduled-service.entity';
import { Service } from '../../services/entities/service.entity';
import { CreateScheduledServiceDto } from '../dto/create-scheduled-service.dto';
import { ServiceBuilder } from '../../services/__tests__/service.builder';

export class ScheduledServiceBuilder {
  private id = 1;
  private serviceDate: Date = new Date('2025-12-15');
  private scheduledHour = '14:30';
  private clientName = 'John Doe';
  private clientPhone = '123-456-7890';
  private service: Service = new ServiceBuilder().build();

  withId(id: number): this {
    this.id = id;
    return this;
  }

  withServiceDate(date: Date): this {
    this.serviceDate = date;
    return this;
  }

  withScheduledHour(hour: string): this {
    this.scheduledHour = hour;
    return this;
  }

  withClientName(name: string): this {
    this.clientName = name;
    return this;
  }

  withClientPhone(phone: string): this {
    this.clientPhone = phone;
    return this;
  }

  withService(service: Service): this {
    this.service = service;
    return this;
  }

  build(): ScheduledService {
    return {
      id: this.id,
      serviceDate: this.serviceDate,
      scheduledHour: this.scheduledHour,
      clientName: this.clientName,
      clientPhone: this.clientPhone,
      service: this.service,
    };
  }

  buildCreateDto(serviceId: number): CreateScheduledServiceDto {
    return {
      serviceDate: this.serviceDate,
      scheduledHour: this.scheduledHour,
      clientName: this.clientName,
      clientPhone: this.clientPhone,
      serviceId,
    };
  }
}
