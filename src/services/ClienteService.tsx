import { Cliente } from "../types/Cliente";
import {ClienteDTO} from '../types/ClienteDTO';

const BASE_URL = 'http://localhost:8080';

export const ClienteService = {
    getAllClientes: async (): Promise<Cliente[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/cliente/paged`);
        const data = await response.json();
        return data;
    },

    getCliente: async (id: number): Promise<Cliente> => {
        const response = await fetch(`${BASE_URL}/api/v1/cliente/${id}`);
        const data = await response.json();
        return data;
    },

    createCliente: async (cliente: Cliente): Promise<Cliente> => {
        const response = await fetch(`${BASE_URL}/api/v1/cliente`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        const data = await response.json();
        return data;
    },

    updateCliente: async (id: number, cliente: Cliente): Promise<Cliente> => {
        const response = await fetch(`${BASE_URL}/api/v1/cliente/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        const data = await response.json();
        return data;
    },

    deleteCliente: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/v1/cliente/${id}`, {
            method: "DELETE"
        });
    },

    showProfile: async (): Promise<ClienteDTO> => {
        try {
            // Recuperar el token del localStorage
            const token = localStorage.getItem('token');
    
            const response = await fetch(`${BASE_URL}/api/v1/cliente/showProfile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Error al recuperar datos');
            }
    
            const data = await response.json();
            console.log('Datos recuperados:', data);
    
            return data;
    
        } catch (error) {
            console.error('Error al recuperar datos');
            throw error;
        }
    }
    
    };