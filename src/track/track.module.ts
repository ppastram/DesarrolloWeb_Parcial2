import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity/track.entity';
import { TrackController } from './track.controller';
import { AlbumController } from 'src/album/album.controller';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { AlbumModule } from '../album/album.module';

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity]), AlbumModule],
  providers: [TrackService],
  controllers: [TrackController]
  //controllers: [TrackController]
})
export class TrackModule {}
