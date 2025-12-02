import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ScheduledServicesService } from './scheduled-services.service';
import { CreateScheduledServiceDto } from './dto/create-scheduled-service.dto';
import { UpdateScheduledServiceDto } from './dto/update-scheduled-service.dto';

@Controller('scheduled-services')
export class ScheduledServicesController {
  constructor(
    private readonly scheduledServicesService: ScheduledServicesService,
  ) {}

  @Post()
  create(@Body() createScheduledServiceDto: CreateScheduledServiceDto) {
    return this.scheduledServicesService.create(createScheduledServiceDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.scheduledServicesService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduledServicesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduledServiceDto: UpdateScheduledServiceDto,
  ) {
    return this.scheduledServicesService.update(+id, updateScheduledServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduledServicesService.remove(+id);
  }
}
