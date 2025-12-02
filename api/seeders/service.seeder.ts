import { faker } from '@faker-js/faker';
import { AppDataSource } from '../src/data-source';
import { Service } from '../src/services/entities/service.entity';

export async function seedServices(): Promise<Service[]> {
  const serviceRepository = AppDataSource.getRepository(Service);

  await serviceRepository.clear();

  const services: Service[] = [];
  const numberOfServices = 20;

  const serviceNameGenerators = [
    () => `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
    () => `${faker.word.adjective()} ${faker.commerce.department()} Service`,
    () => `${faker.commerce.productName()} Treatment`,
    () => `${faker.word.adjective()} ${faker.word.noun()} Session`,
    () => `Professional ${faker.commerce.product()} Service`,
  ];

  for (let i = 0; i < numberOfServices; i++) {
    const nameGenerator = faker.helpers.arrayElement(serviceNameGenerators);

    const service = serviceRepository.create({
      name: nameGenerator(),
      durationTimeMinutes: faker.number.int({
        min: 15,
        max: 180,
      }),
    });
    services.push(service);
  }

  const savedServices = await serviceRepository.save(services);
  console.log(`✅ Seeded ${savedServices.length} services`);

  return savedServices;
}
