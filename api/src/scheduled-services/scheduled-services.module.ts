import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledServicesService } from './scheduled-services.service';
import { ScheduledServicesController } from './scheduled-services.controller';
import { ScheduledService } from './entities/scheduled-service.entity';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduledService]),
    ServicesModule,
  ],
  controllers: [ScheduledServicesController],
  providers: [ScheduledServicesService],
})
export class ScheduledServicesModule {}
