import { Controller, UseInterceptors, Get, Post, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { PerformerService } from './performer.service';
import { PerformerDto } from './performer.dto/performer.dto';
import { PerformerEntity } from './performer.entity/performer.entity';

@Controller('performers')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerController {

    constructor(private readonly performerService: PerformerService) {}

    @Post()
    async create(@Body() performerDto: PerformerDto) {
        const performer: PerformerEntity = plainToInstance(PerformerEntity, performerDto);
        return await this.performerService.create(performer);
    }

    @Get()
    async findAll() {
        return await this.performerService.findAll();
    }

    @Get(':performerId')
    async findOne(@Param('performerId') performerId: string) {
        return await this.performerService.findOne(performerId);
    }

}