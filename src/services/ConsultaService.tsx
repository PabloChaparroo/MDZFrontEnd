import { Cliente } from "../types/Cliente";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface CrearConsultaDTO {
    cliente: Cliente;
    muebleId?: number | null;
    mensajeConsulta: string;
}

export const ConsultaService = {
    // Público: el cliente consulta por un mueble puntual, o hace una consulta general (sin muebleId)
    crearConsulta: async (crearConsultaDTO: CrearConsultaDTO) => {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/consultas/crear`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(crearConsultaDTO)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear la consulta: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al crear la consulta:', error);
            throw error;
        }
    },

    // Admin: todas las consultas paginadas (con y sin mueble)
    obtenerConsultasPaginadas: async (pageNumber: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No autenticado');
            const response = await fetch(`${BASE_URL}/api/v1/consultas/obtener-consultas/${pageNumber}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                throw new Error(`Error al obtener consultas: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener consultas paginadas:', error);
            throw error;
        }
    },

    // Admin: filtrar consultas por nombre de cliente
    filtrarPorNombre: async (nombre: string, pagina = 0, tamanoPagina = 20) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No autenticado');
            const params = new URLSearchParams({ nombre, pagina: String(pagina), tamanoPagina: String(tamanoPagina) });
            const response = await fetch(`${BASE_URL}/api/v1/consultas/filtrar-por-nombre?${params.toString()}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                throw new Error(`Error al filtrar por nombre: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al filtrar consultas por nombre:', error);
            throw error;
        }
    },

    // Admin: guarda la respuesta y la envía por mail al cliente
    responderConsulta: async (id: number, respuesta: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No autenticado');
            const response = await fetch(`${BASE_URL}/api/v1/consultas/${id}/responder`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ respuesta })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al responder la consulta: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al responder la consulta:', error);
            throw error;
        }
    },
};
