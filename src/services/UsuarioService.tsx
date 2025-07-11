import { Usuario } from "../types/Usuario";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const UsuarioService = {

    getAllUsuarios: async (): Promise<Usuario[]> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/usuarios`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error("Error al obtener usuarios");
        const data = await response.json();
        return data;
    },

    getUsuario: async (id: number): Promise<Usuario> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/usuarios/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error("Usuario no encontrado");
        const data = await response.json();
        return data;
    },

    createUsuario: async (usuario: Usuario): Promise<Usuario> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/usuarios`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) throw new Error("Error al crear usuario");
        const data = await response.json();
        return data;
    },

    updateUsuario: async (id: number, usuario: Usuario): Promise<Usuario> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/usuarios/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) throw new Error("Error al actualizar usuario");
        const data = await response.json();
        return data;
    },

    deleteUsuario: async (id: number): Promise<void> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/usuarios/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Error al eliminar usuario");
    }

}