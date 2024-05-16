import { Cliente } from "../types/Cliente";
import { Mueble } from "../types/Mueble";
import { SolicitarVisita } from "../types/SolicitarVisita";


const BASE_URL = 'http://localhost:8080';

export const SolicitarVisitaService = {
    getAllPresupuestos: async (): Promise<SolicitarVisita[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/paged`);
        const data = await response.json();
        return data;
    },

    getSolicitarVisita: async (id: number): Promise<SolicitarVisita> => {
        const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/${id}`);
        const data = await response.json();
        return data;
    },

    createSolicitarVisita: async (solicitarVisita: SolicitarVisita, mueble: Mueble, cliente: Cliente)  => {
    
        try {
            const formData = new FormData();
            formData.append('solicitarVisita', JSON.stringify(solicitarVisita));
            formData.append('mueble', JSON.stringify(mueble));
            formData.append('cliente', JSON.stringify(cliente));

            const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/createSolicitarVisita`, {
                method: "POST",
                body: formData,
               
               
            });
    
            if (!response.ok) {
                throw new Error('Error al crear la solicitud de visita');
            }
    
            return await response.json();
        } catch (error) {
            //console.error('Error al crear la solicitud de visita:', error);
            throw error;
        }
    },
    createSolicitarVisitaSinCliente: async (solicitarVisita: SolicitarVisita)  => {
    
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
        const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/solicitudes?page=0&size=30`);
        const data = await response.json();
        return data;
    },
    

    updateSolicitarVisita: async (id: number, SolicitarVisita: SolicitarVisita): Promise<SolicitarVisita> => {
        const response = await fetch(`${BASE_URL}/api/v1/solicitarVisita/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(SolicitarVisita)
        });

        const data = await response.json();
        return data;
    },

    deleteSolicitarVisita: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/v1/solicitarVisita/${id}`, {
            method: "DELETE"
        });
    }
};