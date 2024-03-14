import { Categoria } from "../types/Categoria";

const BASE_URL = 'http://localhost:8080'

export  const CategoriaService = {
    //metodos
    getAllCategoria: async (): Promise<Categoria[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/categoria`);
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
            const response = await fetch(`${BASE_URL}/api/v1/categoria`, {
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
        const response = await fetch(`${BASE_URL}/api/v1/categoria/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoria)
        });

        const data = await response.json();
        return data;
    },
    deleteCategoria: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/v1/categoria/${id}`, {
            method: "DELETE"
        });
    }
}