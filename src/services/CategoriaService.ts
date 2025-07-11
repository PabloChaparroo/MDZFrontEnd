import { Categoria } from "../types/Categoria";
import { AuthService } from "./AuthService";

const BASE_URL = 'http://localhost:8080'

export const CategoriaService = {

    getAllCategoria: async (): Promise<Categoria[]> => {
        // GET público, no requiere autenticación
        const response = await fetch(`${BASE_URL}/api/v1/categoria/todas`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error al obtener categorías: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },

    getCategoria: async (id: number): Promise<Categoria> => {
        // GET público, no requiere autenticación
        const response = await fetch(`${BASE_URL}/api/v1/categoria/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error al obtener categoría: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },

    createCategoria: async (categoria: Categoria): Promise<Categoria> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        try {
            const response = await fetch(`${BASE_URL}/api/v1/categoria/crear`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear la categoría: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al crear la categoría:", error);
            throw error;
        }
    },

    updateCategoria: async (id: number, categoria: Categoria): Promise<Categoria> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        try {
            const categoriaData = {
                nombreCategoria: categoria.nombreCategoria
            };
            
            const response = await fetch(`${BASE_URL}/api/v1/categoria/modificar/${id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
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
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/categoria/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Error al eliminar la categoría");
        }
    },

    bajaLogicaCategoria: async (id: number): Promise<any> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        try {
            const response = await fetch(`${BASE_URL}/api/v1/categoria/baja-logica/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
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
    },

    getCategoriasDadasDeBaja: async (): Promise<Categoria[]> => {
        try {
            const response = await AuthService.fetchWithAuth(`${BASE_URL}/api/v1/categoria/dadas-de-baja`, {
                method: 'GET'
            });
            if (!response.ok) {
                if (response.status === 400 || response.status === 404) {
                    console.info("No se encontraron categorías dadas de baja o el endpoint no está disponible");
                    return [];
                }
                const errorText = await response.text();
                throw new Error(`Error al obtener las categorías dadas de baja: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
            const data = await response.json();
            // Asegurarse de que siempre se retorna un array
            if (Array.isArray(data)) {
                return data;
            } else if (data && typeof data === 'object' && 'body' in data && Array.isArray(data.body)) {
                // Si el backend devuelve { body: [...] }
                return data.body;
            } else if (data && typeof data === 'object' && 'content' in data && Array.isArray(data.content)) {
                // Si el backend devuelve paginado (Spring Data), usar .content
                return data.content;
            } else if (data == null) {
                return [];
            } else {
                return [data];
            }
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                console.info("Error de red al obtener categorías dadas de baja, retornando array vacío");
                return [];
            }
            console.error("Error al obtener las categorías dadas de baja:", error);
            return [];
        }
    }
}