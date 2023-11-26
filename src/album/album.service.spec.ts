import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity/album.entity';
import { TrackEntity } from '../track/track.entity/track.entity';

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

  const seedDatabase = async () => {
    repository.clear();
    albumList = [];
    for(let i = 0; i < 5; i++){
        const album: AlbumEntity = await repository.save({
        id: faker.string.uuid(),
        nombre: faker.person.fullName(),
        descripcion: faker.lorem.sentence(),
        fecha_lanzamiento: faker.date.past(),
        caratula: faker.image.url(),
        tracks: [],
        performers: []
        })
        albumList.push(album);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //se crea el álbum correctamente
  it('create debería devolver un álbum nuevo', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.person.fullName(),
      descripcion: faker.lorem.sentence(),
      fecha_lanzamiento: faker.date.past(),
      caratula: faker.image.url(),
      tracks: [],
      performers: []
    }

    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();
    expect(newAlbum).toBeDefined();
    expect(newAlbum.id).toBeDefined();
    expect(newAlbum.nombre).toEqual(newAlbum.nombre);
    expect(newAlbum.descripcion).toEqual(newAlbum.descripcion);
    expect(newAlbum.fecha_lanzamiento).toEqual(newAlbum.fecha_lanzamiento);

    const storedAlbum: AlbumEntity = await repository.findOne({where: {id: newAlbum.id}})
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum).toBeDefined();
    expect(storedAlbum.id).toEqual(newAlbum.id);
    expect(storedAlbum.nombre).toEqual(newAlbum.nombre);
    expect(storedAlbum.descripcion).toEqual(newAlbum.descripcion);
    expect(storedAlbum.fecha_lanzamiento).toEqual(newAlbum.fecha_lanzamiento);
  });

  //no se crea un album que tiene la descripcion vacía
  it('create debería lanzar una excepción de negocio cuando el álbum tiene la descripción vacía', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.person.fullName(),
      descripcion: "",
      fecha_lanzamiento: faker.date.past(),
      caratula: faker.image.url(),
      tracks: [],
      performers: []
    }
 
    await expect(service.create(album)).rejects.toHaveProperty("message", "El nombre y la descripción del álbum no pueden estar vacíos");
  });

  //se obtienen todos los ábumes correctamente
  it('findAll debería devolver todos los álbumes', async () => {
      const albums: AlbumEntity[] = await service.findAll();
      expect(albums).not.toBeNull();
      expect(albums).toBeDefined();
      expect(albums).toHaveLength(albumList.length);
      expect(albums[0].id).toEqual(albumList[0].id);
      expect(albums[1].id).toEqual(albumList[1].id);
      expect(albums[2].id).toEqual(albumList[2].id);
      expect(albums[3].id).toEqual(albumList[3].id);
      expect(albums[4].id).toEqual(albumList[4].id);
  });

  //se obtiene un álbum por id correctamente
  it('findOne debería devolver un álbum por id', async () => {
      const album: AlbumEntity = albumList[0];
      const foundAlbum: AlbumEntity = await service.findOne(album.id);
      expect(foundAlbum).not.toBeNull();
      expect(foundAlbum).toBeDefined();
      expect(foundAlbum.id).toEqual(album.id);
      expect(foundAlbum.nombre).toEqual(album.nombre);
      expect(foundAlbum.descripcion).toEqual(album.descripcion);
      expect(foundAlbum.fecha_lanzamiento).toEqual(album.fecha_lanzamiento);
  });

  //no se encuentra un álbum por id cuando el id no existe
  it('findOne debería lanzar una excepción de negocio cuando el álbum no existe', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "El álbum con el id dado no fue encontrado");
  });

  //se elimina un álbum correctamente
  it('delete debería eliminar un álbum', async () => {
      const album = albumList[0];
      await service.delete(album.id);
      
      const albumBorrado = await repository.findOne({where: {id: album.id}})
      expect(albumBorrado).toBeNull();    
  });

  //no se elimina un álbum cuando el álbum tiene tracks asociados
  it('delete debería lanzar una excepción de negocio cuando el álbum tiene tracks asociados', async () => {
    const album = albumList[0];
    const trackCreada: TrackEntity = {id: faker.string.uuid(), nombre: faker.person.fullName(), duracion: faker.number.int(), album: album};
    const trackCreated = await repository.manager.getRepository(TrackEntity).save(trackCreada);

    album.tracks.push(trackCreada);
    await repository.save(album);
    await expect(() => service.delete(album.id)).rejects.toHaveProperty("message", "El álbum no puede ser eliminado porque tiene tracks asociados");
  });

  //no se elimina un álbum cuando el álbum no existe
  it('delete debería lanzar una excepción de negocio cuando el álbum no existe', async () => {
    await expect(service.delete("0")).rejects.toHaveProperty("message", "El álbum con el id dado no fue encontrado");
  });

});