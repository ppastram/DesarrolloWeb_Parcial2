import { Controller, UseInterceptors, Post, Put, Get, Delete, Param, Body } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { PerformerAlbumService } from './performer-album.service';

@Controller('performers')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerAlbumController {
    constructor(private readonly performerAlbumService: PerformerAlbumService){}

    @Post(':performerId/albums/:albumId')
    async addPerformerToAlbum(@Param('performerId') performerId: string, @Param('albumId') albumId: string){
       return await this.performerAlbumService.addPerformerToAlbum(performerId, albumId);
    }
}

