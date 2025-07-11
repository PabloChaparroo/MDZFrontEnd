import { Cliente } from "../types/Cliente";
import {ClienteDTO} from '../types/ClienteDTO';

const BASE_URL = 'http://localhost:8080';

export const ClienteService = {
    getAllClientes: async (): Promise<Cliente[]> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/cliente/paged`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error("Error al obtener clientes");
        const data = await response.json();
        return data;
    },

    getCliente: async (id: number): Promise<Cliente> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/cliente/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error("Cliente no encontrado");
        const data = await response.json();
        return data;
    },

    createCliente: async (cliente: Cliente): Promise<Cliente> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/cliente`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        
        if (!response.ok) throw new Error("Error al crear cliente");
        console.log("El cliente se creó correctamente:", cliente);
        const data = await response.json();
        return data;
    },

    updateCliente: async (id: number, cliente: Cliente): Promise<Cliente> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/cliente/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) throw new Error("Error al actualizar cliente");
        const data = await response.json();
        return data;
    },

    deleteCliente: async (id: number): Promise<void> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/cliente/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Error al eliminar cliente");
    },

    showProfile: async (): Promise<ClienteDTO> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        try {
            const response = await fetch(`${BASE_URL}/api/v1/cliente/showProfile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error('Error al recuperar datos del perfil');
            }
    
            const data = await response.json();
            console.log('Datos del perfil recuperados:', data);
            return data;
    
        } catch (error) {
            console.error('Error al recuperar datos del perfil:', error);
            throw error;
        }
    },

    getClienteByMail: async (mailCliente: string): Promise<Cliente | null> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        console.log("Verificación de email");
        const response = await fetch(`${BASE_URL}/api/v1/cliente/byMailCliente?mailCliente=${encodeURIComponent(mailCliente)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log("Se encontró cliente");
            const data = await response.json();
            return data;
        } else {
            console.log("No existe email, se pasa a crear instancia de cliente");
            return null;
        }
    }
};