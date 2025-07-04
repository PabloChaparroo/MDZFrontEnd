import { Categoria } from "../types/Categoria";

const BASE_URL = 'http://localhost:8080'

export  const CategoriaService = {

    getAllCategoria: async (): Promise<Categoria[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/categoria/todas`);
        const data = await response.json();

        return data;
    },

    getCategoria: async (id: number): Promise <Categoria> => {
        const response = await fetch(`${BASE_URL}/api/v1/categoria/${id}`);
        const data = await response.json();
        return data;
    },

    //Por defecto fetch es un get entonces hacemos lo siguiente para convertirlo en un post
    createCategoria: async (categoria: Categoria): Promise<Categoria> => {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/categoria/crear`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear el categoria: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            // Captura cualquier error y lo imprime en la consola
            console.error("Error al crear el categoria:", error);
            throw error; // Lanza nuevamente el error para que el código que llamó a esta función también pueda manejarlo
        }
    },
    
    

    updateCategoria: async (id: number, categoria: Categoria): Promise<Categoria> => {
        try {
            // Solo enviamos el campo nombreCategoria, no todo el objeto
            const categoriaData = {
                nombreCategoria: categoria.nombreCategoria
            };
            
            const response = await fetch(`${BASE_URL}/api/v1/categoria/modificar/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoriaData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al actualizar la categoría: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al actualizar la categoría:", error);
            throw error;
        }
    },
    
    deleteCategoria: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/v1/categoria/${id}`, {
            method: "DELETE"
        });
    },

    bajaLogicaCategoria: async (id: number): Promise<any> => {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/categoria/baja-logica/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al dar de baja la categoría: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al dar de baja la categoría:", error);
            throw error;
        }
    }
}