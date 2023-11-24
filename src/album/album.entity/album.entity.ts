import { ManyToMany, Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { PerformerEntity } from '../../performer/performer.entity/performer.entity';
import { TrackEntity } from 'src/track/track.entity/track.entity';

@Entity()
export class AlbumEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    caratula: string;
    
    @Column()
    descripcion: string;

    @Column()
    fecha_lanzamiento: Date;

    @JoinTable()
    @ManyToMany(() => PerformerEntity, performer => performer.albums)
    performers: PerformerEntity[];

    @OneToMany(() => TrackEntity, track => track.album)
    tracks: TrackEntity[];
}