import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ScheduledService } from '../../scheduled-services/entities/scheduled-service.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'duration_time_minutes' })
  durationTimeMinutes: number;

  @OneToMany(() => ScheduledService, (scheduledService) => scheduledService.service)
  scheduledServices: ScheduledService[];
}
