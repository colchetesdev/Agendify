import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Service } from '../../services/entities/service.entity';

@Entity('scheduled_services')
export class ScheduledService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', name: 'service_date' })
  serviceDate: Date;

  @Column({ name: 'scheduled_hour' })
  scheduledHour: string;

  @Column({ name: 'client_name' })
  clientName: string;

  @Column({ name: 'client_phone' })
  clientPhone: string;

  @ManyToOne(() => Service, (service) => service.scheduledServices, { eager: true })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
