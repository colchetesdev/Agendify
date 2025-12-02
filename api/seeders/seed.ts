import 'reflect-metadata';
import { AppDataSource } from '../src/data-source';
import { seedServices } from './service.seeder';
import { seedScheduledServices } from './scheduled-service.seeder';

async function runSeeders() {
  try {
    console.log('<1 Starting database seeding...\n');

    await AppDataSource.initialize();
    console.log('Database connection established\n');

    const services = await seedServices();
    await seedScheduledServices(services);

    console.log('\n<� Database seeding completed successfully!');
  } catch (error) {
    console.error('L Error during database seeding:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

runSeeders();
