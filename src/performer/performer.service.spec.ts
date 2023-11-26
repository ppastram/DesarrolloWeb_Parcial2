import { Test, TestingModule } from '@nestjs/testing';
import { PerformerService } from './performer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PerformerEntity } from './performer.entity/performer.entity';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performerList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performerList = [];
    for(let i = 0; i < 5; i++){
        const performer: PerformerEntity = await repository.save({
        id: faker.string.uuid(),
        nombre: faker.person.fullName(),
        descripcion: faker.lorem.word(5),
        imagen: faker.image.url(),
        albums: []
        })
        performerList.push(performer);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //se crea el performer correctamente
  it('create debería devolver un performer nuevo', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.person.fullName(),
      descripcion: faker.lorem.word(5),
      imagen: faker.image.url(),
      albums: []
    }

    const newPerformer = await service.create(performer);
    expect(newPerformer.id).toBeDefined();
    expect(newPerformer.nombre).toEqual(performer.nombre);
    expect(newPerformer.descripcion).toEqual(performer.descripcion);
    expect(newPerformer.imagen).toEqual(performer.imagen);    
  });

  //no se crea un performer porque su descripción tiene más de 100 caracteres
  it('create debería devolver un error si la descripción tiene más de 100 caracteres', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.person.fullName(),
      descripcion: "Esta es una descripción que tiene más de 100 caracteres, por lo que no debería ser válida. Esta es una descripción que tiene más de 100 caracteres, por lo que no debería ser válida. Esta es una descripción que tiene más de 100 caracteres, por lo que no debería ser válida.",
      imagen: faker.image.url(),
      albums: []
    }

    await expect(service.create(performer)).rejects.toHaveProperty("message", "La descripción no puede tener más de 100 caracteres");

  });

  //se obtienen todos los performers correctamente
  it('findAll debería devolver una lista de performers', async () => {
    const performers: PerformerEntity[] = await service.findAll();
    expect(performers).toEqual(performerList);
    expect(performers).not.toBeNull();
    expect(performers.length).toEqual(performerList.length);
    expect(performers[0].id).toEqual(performerList[0].id);
  });

  //se obtiene un performer por id correctamente
  it('findOne debería devolver un performer', async () => {
    const performer: PerformerEntity = performerList[0];
    const foundPerformer: PerformerEntity = await service.findOne(performer.id);
    expect(foundPerformer).toEqual(performer);
    expect(foundPerformer).not.toBeNull();
    expect(foundPerformer.id).toEqual(performer.id);
    expect(foundPerformer.nombre).toEqual(performer.nombre);
    expect(foundPerformer.descripcion).toEqual(performer.descripcion);
    expect(foundPerformer.imagen).toEqual(performer.imagen);
  });

  //no se obtiene un performer por id porque no existe
  it('findOne debería devolver un performer', async () => {
    await expect(() => service.findOne(faker.string.uuid())).rejects.toHaveProperty("message", "El performer con el id dado no fue encontrado"); 
  });
});