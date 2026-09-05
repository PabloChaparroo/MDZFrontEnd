import { Categoria } from "./Categoria";

export interface Mueble {
    id: number;
    nombreMueble: string;
    colorMueble: string;
    descripcion: string;
    imagen: string;

    //Relacion con categoria 
    //categoria: Categoria | null ;
}