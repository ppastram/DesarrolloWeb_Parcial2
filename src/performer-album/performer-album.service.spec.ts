import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PerformerAlbumService } from './performer-album.service';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('PerformerAlbumService', () => {
  let service: PerformerAlbumService;
  let performerRepository: Repository<PerformerEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let performerList : PerformerEntity[];
  let albumList : AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerAlbumService],
    }).compile();

    service = module.get<PerformerAlbumService>(PerformerAlbumService);
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    performerRepository.clear();
    albumRepository.clear();

    performerList = [];
    for(let i = 0; i < 5; i++){
        const performer: PerformerEntity = await performerRepository.save({
        id: faker.string.uuid(),
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        imagen: faker.lorem.sentence(),
        albums: []
        })
        performerList.push(performer);
    }

    albumList = [];
    for(let i = 0; i < 5; i++){
        const album: AlbumEntity = await albumRepository.save({
        id: faker.string.uuid(),
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        fecha_lanzamiento: faker.date.past(),
        caratula: faker.lorem.sentence(),
        tracks: [],
        performers: []
        })
        albumList.push(album);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //se agrega el performer al album correctamente
  it('addPerformerToAlbum debería devolver un album con el performer agregado', async () => {
    const album: AlbumEntity = albumList[0];
    const performer: PerformerEntity = performerList[0];

    const newAlbum = await service.addPerformerToAlbum(album.id, performer.id);
    expect(newAlbum).toBeDefined();
    expect(newAlbum.performers.length).toEqual(1);
    expect(newAlbum.performers[0].id).toEqual(performer.id);
    expect(newAlbum.performers[0].nombre).toEqual(performer.nombre);
    expect(newAlbum.performers[0].descripcion).toEqual(performer.descripcion);
    expect(newAlbum.performers[0].imagen).toEqual(performer.imagen);
  });

  //no se arega el performer al album porque el album no existe
  it('addPerformerToAlbum debería devolver un error de negocio', async () => {
    const album: AlbumEntity = albumList[0];
    const performer: PerformerEntity = performerList[0];

    try {
      const newAlbum = await service.addPerformerToAlbum("123", performer.id);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual("El album con el id dado no fue encontrado");
    }
  });

  //no se arega el performer al album porque el performer no existe
  it('addPerformerToAlbum debería devolver un error de negocio', async () => {
    const album: AlbumEntity = albumList[0];
    const performer: PerformerEntity = performerList[0];

    try {
      const newAlbum = await service.addPerformerToAlbum(album.id, "123");
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual("El performer con el id dado no fue encontrado");
    }
  });

  //no se arega el performer al album porque el album ya tiene 3 performers asociados
  it('addPerformerToAlbum debería devolver un error de negocio', async () => {
    const album: AlbumEntity = albumList[0];
    const performer1: PerformerEntity = performerList[0];
    const performer2: PerformerEntity = performerList[1];
    const performer3: PerformerEntity = performerList[2];
    const performer4: PerformerEntity = performerList[3];

    try {
      const newAlbum = await service.addPerformerToAlbum(album.id, performer1.id);
      const newAlbum2 = await service.addPerformerToAlbum(album.id, performer2.id);
      const newAlbum3 = await service.addPerformerToAlbum(album.id, performer3.id);
      const newAlbum4 = await service.addPerformerToAlbum(album.id, performer4.id);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual("El album no puede tener más de 3 performers asociados");
    }
  });

});
