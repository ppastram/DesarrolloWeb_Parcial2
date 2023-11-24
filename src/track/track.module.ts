import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity])],
  providers: [TrackService]
  //controllers: [TrackController]
})
export class TrackModule {}