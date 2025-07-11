import { Categoria } from "./Categoria";
import { MuebleImagenes } from "./MuebleImagenes";

export interface Mueble {
    id: number;
    nombreMueble: string;
    colorMueble: string;
    dimension: string | null;
    tipoMadera: string;
    precio: number | null;
    descripcion: string;
    fechaAltaMueble: string | null;
    fechaModificacionMueble: string | null,
    fechaBajaMueble: string | null
  

    //Relacion con categoria 
    categoria: Categoria | null ;
     //Relaciones con imagens
     imagenes: MuebleImagenes[];
     // Imagen de portada para el catálogo (puede ser string base64 o objeto)
     imagenPortada: MuebleImagenes | string | null;
     // Nombre de categoría para el catálogo completo
     nombreCategoria?: string;
}