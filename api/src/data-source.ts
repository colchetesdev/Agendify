import { DataSource } from 'typeorm';
import { Service } from './services/entities/service.entity';
import { ScheduledService } from './scheduled-services/entities/scheduled-service.entity';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'agendify.db',
  entities: [Service, ScheduledService],
  synchronize: true,
  logging: false,
});
