import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class AlbumDto {
    
    @IsString()
    @IsNotEmpty()
    readonly id: string;
 
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly caratula: string;

    @IsString()
    @IsNotEmpty()
    readonly fecha_lanzamiento: Date;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsString()
    @IsNotEmpty()
    readonly performers: string[];

    @IsString()
    @IsNotEmpty()
    readonly tracks: string[];
}