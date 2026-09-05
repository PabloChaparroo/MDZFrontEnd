export interface ImagenMueble {
    id: number;
    imagenes: string; // base64
    esPortada: boolean;
}

export interface CatalogoMueble {
    id: number;
    nombreMueble: string;
    colorMueble: string;
    descripcion: string;
    fechaAltaMueble: string;
    fechaModificacionMueble: string;
    nombreCategoria: string;
    imagenPortada: string | null; // base64
    imagenes: ImagenMueble[];
}

export interface PaginaCatalogoMueble {
    content: CatalogoMueble[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
}
