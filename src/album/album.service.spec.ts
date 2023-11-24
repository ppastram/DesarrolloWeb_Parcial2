import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity/album.entity';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumList = [];
    for(let i = 0; i < 5; i++){
        const album: AlbumEntity = await repository.save({
        id: faker.string.uuid(),
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        fecha_lanzamiento: faker.date.past(),
        caratula: faker.lorem.sentence(),
        tracks: []})
        albumList.push(album);
    }
  }

  //se crea el álbum correctamente
  it('create debería devolver un álbum nuevo', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fecha_lanzamiento: faker.date.past(),
      caratula: faker.lorem.sentence(),
      tracks: [],
      performers: []
    }

    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();

    const storedAlbum: AlbumEntity = await repository.findOne({where: {id: newAlbum.id}})
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.nombre).toEqual(newAlbum.nombre)

    expect(storedAlbum.descripcion).toEqual(newAlbum.descripcion)
    expect(storedAlbum.fecha_lanzamiento).toEqual(newAlbum.fecha_lanzamiento)
    expect(storedAlbum.caratula).toEqual(newAlbum.caratula)
  });

  //no se crea un album que tiene la descripcion vacía
  it('create debería lanzar una excepción de negocio cuando el álbum tiene la descripción vacía', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      descripcion: "",
      fecha_lanzamiento: faker.date.past(),
      caratula: faker.lorem.sentence(),
      tracks: [],
      performers: []
    }
 
    await expect(service.create(album)).rejects.toThrowError("El nombre y la descripción del álbum no pueden estar vacíos");
  });

});