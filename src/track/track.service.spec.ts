import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity/track.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let trackList: TrackEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    trackList = [];
    for(let i = 0; i < 5; i++){
        const track: TrackEntity = await repository.save({
        id: faker.string.uuid(),
        nombre: faker.lorem.sentence(),
        duracion: faker.number.int(),
        album: null,
        })
        trackList.push(track);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //se crea el track correctamente
  it('create debería devolver un track nuevo', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      duracion: faker.number.int(),
      album: null,
    }

    const album: AlbumEntity = await albumRepository.save({
      id: "123",
      nombre: faker.person.fullName(),
      caratula: faker.image.url(),
      fecha_lanzamiento: faker.date.past(),   
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    })

    expect(album).toBeDefined();

    const trackCreada: TrackEntity = await service.create(album.id, track);
    expect(trackCreada).not.toBeNull();
    expect(trackCreada).toBeDefined();
    expect(trackCreada.id).toBeDefined();
    expect(trackCreada.nombre).toEqual(track.nombre);
    expect(trackCreada.duracion).toEqual(track.duracion);
    expect(trackCreada.album).toBeDefined();
  });

  //no se crea un track si su duracion es negativa
  it('create debería devolver un error si la duracion es negativa', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.person.fullName(),
      duracion: -1,
      album: null,
    }

    const album: AlbumEntity = await albumRepository.save({
      id: "123",
      nombre: faker.person.fullName(),
      caratula: faker.image.url(),
      fecha_lanzamiento: faker.date.past(),      
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    })

    expect(album).toBeDefined();

    await expect(service.create(album.id, track)).rejects.toHaveProperty("message", "La duración del track debe ser un número positivo");

  });

  //no se crea un track si su album no existe
  it('create debería devolver un error si el album no existe', async () => {

    const albumCreado: AlbumEntity = await albumRepository.save({
      id: "123",
      nombre: faker.person.fullName(),
      caratula: faker.image.url(),
      fecha_lanzamiento: faker.date.past(),      
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    })

    const track: TrackEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      duracion: faker.number.int(),
      album: albumCreado,
    }

    await expect(service.create('000', track)).rejects.toHaveProperty("message", "El album con el id dado no fue encontrado");
  });

  //se obtienen todos los tracks correctamente
  it('findAll debería devolver una lista de tracks', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks.length).toEqual(trackList.length);
    expect(tracks[0].id).toEqual(trackList[0].id);
    expect(tracks[1].id).toEqual(trackList[1].id);
  });

  //se obtiene un track por id correctamente
  it('findOne debería devolver un track por id', async () => {
    const track: TrackEntity = trackList[0];
    const foundTrack: TrackEntity = await service.findOne(track.id);
    expect(foundTrack).not.toBeNull();
    expect(foundTrack.id).toEqual(track.id);
    expect(foundTrack.nombre).toEqual(track.nombre);
    expect(foundTrack.duracion).toEqual(track.duracion);
  });

  //no se obtiene un track por id si no existe
  it('findOne debería devolver null si no existe el track', async () => {
    await expect(() => service.findOne(faker.string.uuid())).rejects.toHaveProperty("message", "El track con el id dado no fue encontrado"); 
  });

});
