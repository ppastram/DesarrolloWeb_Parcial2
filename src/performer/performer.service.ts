import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';

@Injectable()
export class PerformerService {
    constructor(
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity> 
    ){}

    async create(performer: PerformerEntity): Promise<PerformerEntity> {
        //valide que la descripcion tenga maximo 100 caracteres
        if (performer.descripcion.length > 100)
            throw new BusinessLogicException("La descripción del performer no puede tener más de 100 caracteres", BusinessError.PRECONDITION_FAILED);

        return await this.performerRepository.save(performer);
    }
    
    async findAll(): Promise<PerformerEntity[]> {
        return await this.performerRepository.find({ relations: ["albums"] });
    }

    async findOne(id: string): Promise<PerformerEntity> {
        const performer: PerformerEntity = await this.performerRepository.findOne({where: {id}, relations: ["albums"] } );
        if (!performer)
          throw new BusinessLogicException("El performer con el id dado no fue encontrado", BusinessError.NOT_FOUND);
   
        return performer;
    }
}
