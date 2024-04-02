import { Mueble } from "../types/Mueble";

const BASE_URL = 'http://localhost:8080'

export  const MuebleService = {
    //metodos
    getAllMuebles: async (): Promise<Mueble[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/mueble`);
        const data = await response.json();

        return data;
    },
    getMueblesByCategoria: async (categoria: string) => {
        try {
          const response = await fetch(`${BASE_URL}/api/v1/mueble?categoria=${categoria}`);
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

    getMueble: async (id: number): Promise <Mueble> => {
        const response = await fetch(`${BASE_URL}/api/v1/mueble/${id}`);
        const data = await response.json();
        return data;
    },

    //Por defecto fetch es un get entonces hacemos lo siguiente para convertirlo en un post
    createMuebleSoly: async (mueble: Mueble): Promise<Mueble> => {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/mueble`, {
                method: "POST",
                
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mueble)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear el mueble: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            // Captura cualquier error y lo imprime en la consola
            console.error("Error al crear el mueble:", error);
            throw error; // Lanza nuevamente el error para que el código que llamó a esta función también pueda manejarlo
        }
    },

    createMueble: async (mueble: Mueble, files: FileList): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append('mueble', JSON.stringify(mueble)); // Convertir el objeto Mueble a JSON y agregarlo al formulario
    
            // Agregar archivos al formulario
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
    
            const response = await fetch(`${BASE_URL}/api/v1/mueble/create`, {
                method: "POST",
                body: formData, // Envía el FormData en el cuerpo de la solicitud
               
            })
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear el mueble: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
    
            // Si la respuesta es exitosa, no es necesario devolver ningún dato
        } catch (error) {
            // Captura cualquier error y lo imprime en la consola
            console.error("Error al crear el mueble:", error);
            throw error; // Lanza nuevamente el error para que el código que llamó a esta función también pueda manejarlo
        }
    },
    
    

    updateMueble: async (id: number, mueble: Mueble, files: FileList | null): Promise<void> => {
        try {
            // Primero, actualizamos los datos del mueble
            const responseMueble = await fetch(`${BASE_URL}/api/v1/mueble/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mueble)
            });
    
            if (!responseMueble.ok) {
                const errorText = await responseMueble.text();
                throw new Error(`Error al actualizar el mueble: ${responseMueble.status} ${responseMueble.statusText}. Detalles: ${errorText}`);
            }
    
            // Luego, si hay archivos nuevos, actualizamos las imágenes asociadas al mueble
            if (files) {
                const formData = new FormData();
                formData.append('muebleId', id.toString()); // Agregar el ID del mueble al formulario
        
                // Agregar archivos al formulario
                for (let i = 0; i < files.length; i++) {
                    formData.append('files', files[i]);
                }
        
                const responseImagenes = await fetch(`${BASE_URL}/api/v1/mueble/${id}/imagenes`, {
                    method: "PUT",
                    body: formData
                });
    
                if (!responseImagenes.ok) {
                    const errorText = await responseImagenes.text();
                    throw new Error(`Error al actualizar las imágenes del mueble: ${responseImagenes.status} ${responseImagenes.statusText}. Detalles: ${errorText}`);
                }
            }
        } catch (error) {
            // Captura cualquier error y lo imprime en la consola
            console.error("Error al actualizar el mueble:", error);
            throw error; // Lanza nuevamente el error para que el código que llamó a esta función también pueda manejarlo
        }
    }
    ,/*

    createMueble: async (mueble: Mueble, files: FileList, portadaIndex?: number): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append('mueble', JSON.stringify(mueble)); // Convertir el objeto Mueble a JSON y agregarlo al formulario

            // Agregar archivos al formulario
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            // Si se proporciona un índice de portada, agregarlo al formulario
            if (portadaIndex !== undefined) {
                formData.append('portadaIndex', portadaIndex.toString());
            }

            const response = await fetch(`${BASE_URL}/api/v1/mueble/create`, {
                method: "POST",
                body: formData, // Envía el FormData en el cuerpo de la solicitud
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear el mueble: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }

            // Si la respuesta es exitosa, no es necesario devolver ningún dato
        } catch (error) {
            console.error("Error al crear el mueble:", error);
            throw error;
        }
    },

    updateMueble: async (id: number, mueble: Mueble, files: FileList | null, portadaIndex?: number): Promise<void> => {
        try {
            // Primero, actualizamos los datos del mueble
            const responseMueble = await fetch(`${BASE_URL}/api/v1/mueble/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mueble)
            });

            if (!responseMueble.ok) {
                const errorText = await responseMueble.text();
                throw new Error(`Error al actualizar el mueble: ${responseMueble.status} ${responseMueble.statusText}. Detalles: ${errorText}`);
            }

            // Luego, si hay archivos nuevos, actualizamos las imágenes asociadas al mueble
            if (files) {
                const formData = new FormData();
                formData.append('muebleId', id.toString()); // Agregar el ID del mueble al formulario

                // Agregar archivos al formulario
                for (let i = 0; i < files.length; i++) {
                    formData.append('files', files[i]);
                }

                // Si se proporciona un índice de portada, agregarlo al formulario
                if (portadaIndex !== undefined) {
                    formData.append('portadaIndex', portadaIndex.toString());
                }

                const responseImagenes = await fetch(`${BASE_URL}/api/v1/mueble/${id}/imagenes`, {
                    method: "PUT",
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
    },*/
    deleteMueble: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/v1/mueble/${id}`, {
            method: "DELETE"
        });
    },

    getMueblesByPage: async (pageNumber: number): Promise<Mueble[]> => {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/mueble/page/${pageNumber}`);
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
    

    
    
}