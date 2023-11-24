import { ManyToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumEntity } from '../../album/album.entity/album.entity';

@Entity()
export class PerformerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    descripcion: string;
    
    @Column()
    imagen: string;

    @ManyToMany(() => AlbumEntity, album => album.performers)
    albums: AlbumEntity[];

}