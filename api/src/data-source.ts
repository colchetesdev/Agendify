import { DataSource } from 'typeorm';
import { Service } from './services/entities/service.entity';
import { ScheduledService } from './scheduled-services/entities/scheduled-service.entity';

export class DataSourceSingleton {
  private static instance: DataSource;

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new DataSource({
      type: 'better-sqlite3',
      database: 'agendify.db',
      entities: [Service, ScheduledService],
      synchronize: true,
      logging: false,
    });
    return this.instance;
  }
}

export const AppDataSource = DataSourceSingleton.getInstance();
