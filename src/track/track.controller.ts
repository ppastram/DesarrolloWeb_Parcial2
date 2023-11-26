import { Controller, UseInterceptors, Get, Post, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { TrackService } from './track.service';
import { TrackDto } from './track.dto/track.dto';
import { TrackEntity } from './track.entity/track.entity';

@Controller('tracks')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {
    constructor(private readonly trackService: TrackService) {}

    @Post()
    async create(@Param('albumId') albumId: string, @Body() trackDto: TrackDto) {
        const track: TrackEntity = plainToInstance(TrackEntity, trackDto);
        return await this.trackService.create(albumId, track);
    }

    @Get()
    async findAll() {
        return await this.trackService.findAll();
    }

    @Get(':trackId')
    async findOne(@Param('trackId') trackId: string) {
        return await this.trackService.findOne(trackId);
    }

}