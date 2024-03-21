import { Categoria } from "./Categoria";

export interface Mueble {
    id: number;
    nombreMueble: string;
    colorMueble: string;
    dimension: string;
    tipoMadera: string;
    precio: number;
    descripcion: string;
    imagen: string;

    //Relacion con categoria 
    categoria: Categoria | null ;
}