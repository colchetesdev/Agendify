import { IsString, IsInt, IsNotEmpty, IsDateString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduledServiceDto {
  @IsDateString()
  @IsNotEmpty()
  serviceDate: Date;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'scheduledHour must be in HH:mm format',
  })
  scheduledHour: string;

  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  clientPhone: string;

  @IsInt()
  @Type(() => Number)
  serviceId: number;
}
