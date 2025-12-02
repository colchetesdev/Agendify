import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledServicesModule } from './scheduled-services/scheduled-services.module';
import { ServicesModule } from './services/services.module';
import { Service } from './services/entities/service.entity';
import { ScheduledService } from './scheduled-services/entities/scheduled-service.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'agendify.db',
      entities: [Service, ScheduledService],
      synchronize: true,
      logging: false,
    }),
    ServicesModule,
    ScheduledServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
