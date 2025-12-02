import { faker } from '@faker-js/faker';
import { AppDataSource } from '../src/data-source';
import { ScheduledService } from '../src/scheduled-services/entities/scheduled-service.entity';
import { Service } from '../src/services/entities/service.entity';

export async function seedScheduledServices(
  services: Service[],
): Promise<ScheduledService[]> {
  const scheduledServiceRepository =
    AppDataSource.getRepository(ScheduledService);

  await scheduledServiceRepository.clear();

  const scheduledServices: ScheduledService[] = [];
  const numberOfScheduledServices = 50;

  for (let i = 0; i < numberOfScheduledServices; i++) {
    const serviceDate = faker.date.between({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });

    const hours = faker.number.int({ min: 8, max: 17 });
    const minutes = faker.helpers.arrayElement(['00', '30']);
    const scheduledHour = `${hours.toString().padStart(2, '0')}:${minutes}`;

    const randomService = faker.helpers.arrayElement(services);

    const scheduledService = scheduledServiceRepository.create({
      serviceDate,
      scheduledHour,
      clientName: faker.person.fullName(),
      clientPhone: faker.phone.number({ style: 'international' }),
      service: randomService,
    });

    scheduledServices.push(scheduledService);
  }

  const savedScheduledServices =
    await scheduledServiceRepository.save(scheduledServices);
  console.log(`Seeded ${savedScheduledServices.length} scheduled services`);

  return savedScheduledServices;
}
