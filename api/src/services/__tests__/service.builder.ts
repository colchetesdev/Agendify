import { Service } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';

export class ServiceBuilder {
  private id = 1;
  private name = 'Sample Service';
  private durationTimeMinutes = 30;
  private scheduledServices: Service['scheduledServices'] = [];

  withId(id: number): this {
    this.id = id;
    return this;
  }

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withDuration(minutes: number): this {
    this.durationTimeMinutes = minutes;
    return this;
  }

  withScheduledServices(services: Service['scheduledServices']): this {
    this.scheduledServices = services;
    return this;
  }

  build(): Service {
    return {
      id: this.id,
      name: this.name,
      durationTimeMinutes: this.durationTimeMinutes,
      scheduledServices: this.scheduledServices,
    };
  }

  buildCreateDto(): CreateServiceDto {
    return {
      name: this.name,
      durationTimeMinutes: this.durationTimeMinutes,
    };
  }
}
