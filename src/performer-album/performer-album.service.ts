import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';

@Injectable()
export class PerformerAlbumService {
    constructor(
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>,
    
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ) {}

    async addPerformerToAlbum(performerId: string, albumId: string,): Promise<AlbumEntity> {

        //valide que tanto el album como el performer existan
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ['performers', 'tracks']});
        if (!album)
            throw new BusinessLogicException("El album con el id dado no fue encontrado", BusinessError.NOT_FOUND);

        const performer: PerformerEntity = await this.performerRepository.findOne({where: {id: performerId}});
        if (!performer)
            throw new BusinessLogicException("El performer con el id dado no fue encontrado", BusinessError.NOT_FOUND);

        //valide que el album no quede con más de 3 performers asociados
        if (album.performers.length >= 3)
            throw new BusinessLogicException("El album no puede tener más de 3 performers asociados", BusinessError.PRECONDITION_FAILED);

        album.performers = [...album.performers, performer];
        return await this.albumRepository.save(album);
    }

}
