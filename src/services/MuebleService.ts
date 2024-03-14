import { Mueble } from "../types/Mueble";

const BASE_URL = 'http://localhost:8080'

export  const MuebleService = {
    //metodos
    getAllMuebles: async (): Promise<Mueble[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/mueble`);
        const data = await response.json();

        return data;
    },

    getMueble: async (id: number): Promise <Mueble> => {
        const response = await fetch(`${BASE_URL}/api/v1/mueble/${id}`);
        const data = await response.json();
        return data;
    },

    //Por defecto fetch es un get entonces hacemos lo siguiente para convertirlo en un post
    createMueble: async (mueble: Mueble): Promise<Mueble> => {
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
    
    

    updateMueble: async (id: number, mueble: Mueble): Promise<Mueble> => {
        const response = await fetch(`${BASE_URL}/api/v1/mueble/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mueble)
        });

        const data = await response.json();
        return data;
    },
    deleteMueble: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/v1/mueble/${id}`, {
            method: "DELETE"
        });
    }
}