import { Mueble } from "../types/Mueble";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const REQUEST_TIMEOUT = 30000; // 30 segundos timeout

// Función helper para crear fetch con timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = REQUEST_TIMEOUT) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('La solicitud ha tardado demasiado tiempo. Por favor, intente nuevamente.');
        }
        throw error;
    }
};

// Función helper para obtener headers con autorización
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// Función helper para obtener headers sin Content-Type (para FormData)
const getAuthHeadersNoContentType = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    };
};

// Función helper para verificar autenticación
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');
    return token;
};

export const MuebleService = {
    // Métodos públicos (no requieren autenticación)
    getAllMuebles: async (): Promise<Mueble[]> => {
        const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble`);
        const data = await response.json();
        return data;
    },

    getMueblesByCategoria: async (categoria: string) => {
        try {
            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble?categoria=${categoria}`);
            if (!response.ok) {
                throw new Error(`Error al obtener los muebles por categoría: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener los muebles por categoría:', error);
            throw error;
        }
    },

    getMueble: async (id: number): Promise<Mueble> => {
        const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/${id}`);
        const data = await response.json();
        return data;
    },

    getCatalogoMueblesAll: async (pageNumber: number): Promise<{content: Mueble[], totalPages: number, totalElements: number, currentPage: number}> => {
        try {
            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/catalogo-completo/${pageNumber}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener el catálogo: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener el catálogo:', error);
            throw error;
        }
    },

    getCatalogoMueblesByCategoria: async (pageNumber: number, categoriaId: number): Promise<{content: Mueble[], totalPages: number, totalElements: number, currentPage: number}> => {
        try {
            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/muebles-por-categoria/${pageNumber}/categoria/${categoriaId}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener el catálogo por categoría: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener el catálogo por categoría:', error);
            throw error;
        }
    },

    obtenerImagenesMueble: async (id: number): Promise<any> => {
        try {
            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/${id}/imagenes`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener las imágenes del mueble: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener las imágenes del mueble:', error);
            throw error;
        }
    },

    filtrarPorNombreOColor: async (filtro: string, pageNumber: number = 0): Promise<{content: Mueble[], totalPages: number, totalElements: number, currentPage: number}> => {
        try {
            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/filtrar/buscar/${encodeURIComponent(filtro)}/${pageNumber}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al filtrar muebles: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al filtrar muebles por nombre o color:', error);
            throw error;
        }
    },

    // Métodos protegidos (requieren autenticación)
    createMuebleSoly: async (mueble: Mueble): Promise<Mueble> => {
        checkAuth();

        try {
            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/create`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(mueble)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear el mueble: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al crear el mueble:", error);
            throw error;
        }
    },

    createMueble: async (mueble: Mueble, categoriaId: number, files: FileList, portadaIndex?: number): Promise<void> => {
        checkAuth();

        try {
            const formData = new FormData();
            
            const muebleSinCategoria = {
                id: mueble.id,
                nombreMueble: mueble.nombreMueble,
                fechaAltaMueble: mueble.fechaAltaMueble,
                fechaModificacionMueble: mueble.fechaModificacionMueble,
                fechaBajaMueble: mueble.fechaBajaMueble,
                colorMueble: mueble.colorMueble,
                dimension: mueble.dimension,
                tipoMadera: mueble.tipoMadera,
                precio: mueble.precio,
                descripcion: mueble.descripcion
            };
            
            formData.append('mueble', JSON.stringify(muebleSinCategoria));
            formData.append('categoriaId', categoriaId.toString());
            formData.append('portadaIndex', portadaIndex?.toString() || '0');

            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/create`, {
                method: "POST",
                headers: getAuthHeadersNoContentType(),
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear el mueble: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }

        } catch (error) {
            console.error("Error al crear el mueble:", error);
            throw error;
        }
    },

    updateMueble: async (id: number, mueble: Mueble, files: FileList | null, portadaIndex?: number): Promise<void> => {
        checkAuth();

        try {
            const responseMueble = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/${id}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(mueble)
            });

            if (!responseMueble.ok) {
                const errorText = await responseMueble.text();
                throw new Error(`Error al actualizar el mueble: ${responseMueble.status} ${responseMueble.statusText}. Detalles: ${errorText}`);
            }

            if (files && files.length > 0) {
                const formData = new FormData();
                
                for (let i = 0; i < files.length; i++) {
                    formData.append('files', files[i]);
                }

                if (portadaIndex !== undefined) {
                    formData.append('portadaIndex', portadaIndex.toString());
                }

                const responseImagenes = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/${id}/imagenes`, {
                    method: "PUT",
                    headers: getAuthHeadersNoContentType(),
                    body: formData
                });

                if (!responseImagenes.ok) {
                    const errorText = await responseImagenes.text();
                    throw new Error(`Error al actualizar las imágenes del mueble: ${responseImagenes.status} ${responseImagenes.statusText}. Detalles: ${errorText}`);
                }
            }
        } catch (error) {
            console.error("Error al actualizar el mueble:", error);
            throw error;
        }
    },

    deleteMueble: async (id: number): Promise<void> => {
        checkAuth();

        const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/${id}`, {
            method: "DELETE",
            headers: getAuthHeadersNoContentType()
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el mueble");
        }
    },

    bajaLogicaMueble: async (id: number): Promise<void> => {
        checkAuth();

        try {
            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/baja-logica/${id}`, {
                method: "DELETE",
                headers: getAuthHeadersNoContentType()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al dar de baja el mueble: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
        } catch (error) {
            console.error("Error al dar de baja el mueble:", error);
            throw error;
        }
    },

    getMueblesByPage: async (pageNumber: number): Promise<Mueble[]> => {
        checkAuth();

        try {
            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/page/${pageNumber}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                throw new Error(`Error al obtener los muebles por página: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data.content;
        } catch (error) {
            console.error('Error al obtener los muebles por página:', error);
            throw error;
        }
    },

    agregarImagenesMueble: async (id: number, files: FileList, portadaIndex?: number): Promise<void> => {
        checkAuth();

        try {
            if (!files || files.length === 0) {
                throw new Error('No se proporcionaron archivos para agregar');
            }

            const formData = new FormData();
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                if (!file.type.startsWith('image/')) {
                    throw new Error(`El archivo ${file.name} no es una imagen válida`);
                }
                
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    throw new Error(`El archivo ${file.name} es demasiado grande. Tamaño máximo: 5MB`);
                }
                
                formData.append('files', file);
            }

            if (portadaIndex !== undefined && portadaIndex >= 0) {
                formData.append('portadaIndex', portadaIndex.toString());
            }

            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/${id}/agregar-imagenes`, {
                method: "POST",
                headers: getAuthHeadersNoContentType(),
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al agregar imágenes al mueble: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }

        } catch (error) {
            console.error("Error al agregar imágenes al mueble:", error);
            throw error;
        }
    },

    eliminarImagen: async (imagenId: number): Promise<void> => {
        checkAuth();

        try {
            if (!imagenId || imagenId <= 0) {
                throw new Error('ID de imagen inválido');
            }

            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/imagen/${imagenId}`, {
                method: "DELETE",
                headers: getAuthHeadersNoContentType()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al eliminar la imagen: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }

        } catch (error) {
            console.error("Error al eliminar imagen:", error);
            throw error;
        }
    },

    establecerImagenPortada: async (imagenId: number): Promise<void> => {
        checkAuth();

        try {
            if (!imagenId || imagenId <= 0) {
                throw new Error('ID de imagen inválido');
            }

            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/imagen/${imagenId}/establecer-portada`, {
                method: "PUT",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al establecer imagen como portada: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }

        } catch (error) {
            console.error("Error al establecer imagen como portada:", error);
            throw error;
        }
    },
    
    getMueblesDadosDeBaja: async (pageNumber: number): Promise<{muebles: Mueble[], totalPages: number, totalElements?: number, currentPage: number}> => {
        checkAuth();

        try {
            const response = await fetchWithTimeout(`${BASE_URL}/api/v1/mueble/dados-de-baja/${pageNumber}`, {
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener los muebles dados de baja: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Error al obtener muebles dados de baja:', error);
            throw error;
        }
    }
};
