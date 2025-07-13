
import { Cliente } from "../types/Cliente";
import { Mueble } from "../types/Mueble";
import { SolicitarVisita } from "../types/SolicitarVisita";


const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const SolicitarVisitaService = {
    getAllPresupuestos: async (): Promise<SolicitarVisita[]> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/paged`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error("Error al obtener solicitudes de visita");
        const data = await response.json();
        return data;
    },
        filtrarPorNombre: async (nombre: string, pagina = 0, tamanoPagina = 20) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No autenticado');
            const params = new URLSearchParams({ nombre, pagina: String(pagina), tamanoPagina: String(tamanoPagina) });
            const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/filtrar-por-nombre?${params.toString()}`,
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
            console.error('Error al filtrar solicitudes/consultas por nombre:', error);
            throw error;
        }
    },

    getSolicitarVisita: async (id: number): Promise<SolicitarVisita> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error("Solicitud de visita no encontrada");
        const data = await response.json();
        return data;
    },

    createSolicitarVisita: async (solicitarVisita: SolicitarVisita, mueble: Mueble, cliente: Cliente) => {
        // Ahora solo se envía el id del mueble, no el objeto completo
        try {
            const formData = new FormData();
            formData.append('solicitarVisita', JSON.stringify(solicitarVisita));
            formData.append('muebleId', String(mueble.id));
            formData.append('cliente', JSON.stringify(cliente));

            const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/createSolicitarVisita`, {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear la solicitud de visita: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }
    
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    createSolicitarVisitaSinCliente: async (solicitarVisita: SolicitarVisita) => {
        // Este método puede mantenerse sin token ya que es para clientes públicos
        try {
            const formData = new FormData();
            formData.append('solicitarVisita', JSON.stringify(solicitarVisita));
            //formData.append('mueble', JSON.stringify(mueble));
            

            const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita`, {
                method: "POST",
                body: formData,
               
               
            });
    
            if (!response.ok) {
                throw new Error('Error al crear la solicitud de visita');
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error al crear la solicitud de visita:', error);
            throw error;
        }
    },

    getUltimos30Solicitudes: async (): Promise<SolicitarVisita[]> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/solicitudes?page=0&size=30`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error("Error al obtener últimas solicitudes");
        const data = await response.json();
        return data;
    },

    updateSolicitarVisita: async (id: number, SolicitarVisita: SolicitarVisita): Promise<SolicitarVisita> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(SolicitarVisita)
        });

        if (!response.ok) throw new Error("Error al actualizar solicitud de visita");
        const data = await response.json();
        return data;
    },

    deleteSolicitarVisita: async (id: number): Promise<void> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Error al eliminar solicitud de visita");
    },

    crearConsulta: async (crearConsultaDTO: { cliente: Cliente, consultaSolicitarVisita: string }) => {
        // Este método puede mantenerse sin token ya que es para consultas públicas
        try {
            const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/crearConsulta`, {
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

    obtenerConsultasPaginadas: async (pageNumber: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No autenticado');
            const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/obtener-consultas/${pageNumber}`,
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

    cambiarEstadoSolicitud: async (id: number, nuevoEstado: string) => {
        try {
            console.log('🔄 [FRONTEND] Iniciando cambio de estado:', { id, nuevoEstado });
            
            const cambiarEstadoDTO = { estado: nuevoEstado };
            console.log('📤 [FRONTEND] Enviando DTO:', cambiarEstadoDTO);
            
            const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/${id}/estado`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cambiarEstadoDTO)
            });

            console.log('📥 [FRONTEND] Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ [FRONTEND] Error response:', errorText);
                throw new Error(`Error al cambiar estado: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
            }

            const resultado = await response.json();
            console.log('✅ [FRONTEND] Estado cambiado exitosamente:', resultado);
            return resultado;
        } catch (error) {
            console.error('❌ [FRONTEND] Error al cambiar estado de solicitud:', error);
            throw error;
        }
    },

    obtenerSolicitudesConMueblePaginadas: async (pageNumber: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No autenticado');
            const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/obtener-solicitudes-con-mueble/${pageNumber}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                throw new Error(`Error al obtener solicitudes con mueble: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener solicitudes con mueble paginadas:', error);
            throw error;
        }
    }
};