import { TypeOrmModule } from '@nestjs/typeorm';
// IMPORTAR SIN SRC, SOLO CON .. -> import { AeropuertoEntity } from '../../aeropuerto/aeropuerto.entity/aeropuerto.entity'; 

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [],         
      synchronize: true,
      keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([]),   //entidades
   ];