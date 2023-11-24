import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { TrackEntity } from '../track/track.entity/track.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>,

        //@InjectRepository(AlbumEntity)
        //private readonly albumRepository: Repository<TrackEntity> 
    ){}

    async create(albumId: string, track: TrackEntity): Promise<TrackEntity> {
        //valide que la duracion del track sea un número positivo
        if (track.duracion < 0)
            throw new BusinessLogicException("La duración del track debe ser un número positivo", BusinessError.PRECONDITION_FAILED);

        //valide que el album cuyo identificador es albumId exista
        //buscar con findOne de album si existe el album con el id dado


        //const albumBuscado: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}});
        //if (!albumBuscado)
        //    throw new BusinessLogicException("El album con el id dado no fue encontrado", BusinessError.NOT_FOUND);

        return await this.trackRepository.save(track);
    }

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({ relations: ["album"] });
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track: TrackEntity = await this.trackRepository.findOne({where: {id}, relations: ["album"] } );
        if (!track)
          throw new BusinessLogicException("El track con el id dado no fue encontrado", BusinessError.NOT_FOUND);
   
        return track;
    }
}
