import { Controller, UseInterceptors, Get, Post, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { AlbumService } from './album.service';
import { AlbumDto } from './album.dto/album.dto';
import { AlbumEntity } from './album.entity/album.entity';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
    constructor(private readonly albumService: AlbumService) {}

    @Post()
    async create(@Body() albumDto: AlbumDto) {
        const album: AlbumEntity = plainToInstance(AlbumEntity, albumDto);
        return await this.albumService.create(album);
    }

    @Get()
    async findAll() {
        return await this.albumService.findAll();
    }

    @Get(':albumId')
    async findOne(@Param('albumId') albumId: string) {
        return await this.albumService.findOne(albumId);
    }

    @Delete(':albumId')
    @HttpCode(204)
    async delete(@Param('albumId') albumId: string) {
        return await this.albumService.delete(albumId);
    }

}

