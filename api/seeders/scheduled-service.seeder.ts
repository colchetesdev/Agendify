import { faker } from '@faker-js/faker';
import { AppDataSource } from '../src/data-source';
import { ScheduledService } from '../src/scheduled-services/entities/scheduled-service.entity';
import { Service } from '../src/services/entities/service.entity';

export async function seedScheduledServices(
  services: Service[],
): Promise<ScheduledService[]> {
  const scheduledServiceRepository =
    AppDataSource.getRepository(ScheduledService);

  // Clear existing scheduled services
  await scheduledServiceRepository.clear();

  const scheduledServices: ScheduledService[] = [];
  const numberOfScheduledServices = 50;

  for (let i = 0; i < numberOfScheduledServices; i++) {
    // Random date between 30 days ago and 60 days in the future
    const serviceDate = faker.date.between({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });

    // Random hour between 8:00 and 18:00 with 30-minute intervals
    const hours = faker.number.int({ min: 8, max: 17 });
    const minutes = faker.helpers.arrayElement(['00', '30']);
    const scheduledHour = `${hours.toString().padStart(2, '0')}:${minutes}`;

    // Random service from the seeded services
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
  console.log(
    ` Seeded ${savedScheduledServices.length} scheduled services`,
  );

  return savedScheduledServices;
}
