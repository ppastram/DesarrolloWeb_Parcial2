import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class TrackDto {
    
    @IsString()
    @IsNotEmpty()
    readonly id: string;
 
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly duracion: number;

    @IsString()
    @IsNotEmpty()
    readonly album: string;
}