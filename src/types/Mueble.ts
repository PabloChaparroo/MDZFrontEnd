import { Categoria } from "./Categoria";
import { MuebleImagenes } from "./MuebleImagenes";

export interface Mueble {
    id: number;
    nombreMueble: string;
    colorMueble: string;
    dimension: string;
    tipoMadera: string;
    precio: number;
    descripcion: string;
    fechaAltaMueble: string;
  

    //Relacion con categoria 
    categoria: Categoria | null ;
     //Relaciones con imagens
     imagenes: MuebleImagenes[];
}