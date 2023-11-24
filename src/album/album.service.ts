import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { AlbumEntity } from './album.entity/album.entity';


@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity> 
    ){}

    async create(album: AlbumEntity): Promise<AlbumEntity> {
        //valide que el nombre y la descripción del album no estén vacías
        if (album.nombre == "" || album.descripcion == "")
            throw new BusinessLogicException("El nombre y la descripción del álbum no pueden estar vacíos", BusinessError.PRECONDITION_FAILED);

        return await this.albumRepository.save(album);
    }
    
    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumRepository.find({ relations: ["performers"] });
    }

    async findOne(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id}, relations: ["performers"] } );
        if (!album)
          throw new BusinessLogicException("El álbum con el id dado no fue encontrado", BusinessError.NOT_FOUND);
   
        return album;
    }

    async delete(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where:{id}});

        if (!album)
          throw new BusinessLogicException("El álbum con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        
        //valide que el album no tenga tracks asociados
        if (album.tracks.length > 0)
          throw new BusinessLogicException("El álbum no puede ser eliminado porque tiene tracks asociados", BusinessError.PRECONDITION_FAILED);
      
        return await this.albumRepository.remove(album);
    }

}
