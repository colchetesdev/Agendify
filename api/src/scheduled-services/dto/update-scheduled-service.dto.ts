import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduledServiceDto } from './create-scheduled-service.dto';

export class UpdateScheduledServiceDto extends PartialType(CreateScheduledServiceDto) {}
