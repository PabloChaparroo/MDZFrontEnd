import { MuebleImagenes } from "../types/MuebleImagenes";


const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const MuebleImagenesService = {
    getAllMuebleImagenes: async (): Promise<MuebleImagenes[]> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/muebleImagenes`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error("Error al obtener imágenes de muebles");
        const data = await response.json();
        return data;
    },

    getMuebleImagenes: async (id: number): Promise<MuebleImagenes> => {
        const response = await fetch(`${BASE_URL}/api/v1/muebleImagenes/${id}`);
        
        if (!response.ok) throw new Error("Imagen de mueble no encontrada");
        const data = await response.json();
        return data;
    },

    updateMueble: async (id: number, muebleImagenes: MuebleImagenes): Promise<MuebleImagenes> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/muebleImagenes/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(muebleImagenes)
        });

        if (!response.ok) throw new Error("Error al actualizar imagen de mueble");
        const data = await response.json();
        return data;
    },

    deleteMueble: async (id: number): Promise<void> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await fetch(`${BASE_URL}/api/v1/muebleImagenes/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Error al eliminar imagen de mueble");
    },

    createImagenes: async (files: FileList, muebleId: number): Promise<string> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        try {
            console.log("Ejecutando el servidor crear");
            const formData = new FormData();
            //Agregar archivo al formulario
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

        const response = await fetch(`${BASE_URL}/api/v1/muebleImagenes/imagenes${muebleId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al cargar las imágenes: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
        }

        return 'Imágenes cargadas correctamente';
    } catch (error) {
        console.error('Error al cargar las imágenes:', error);
        throw new Error('Error al cargar las imágenes');
    }
},

updateImagenes: async (muebleId: number, files: FileList): Promise<string> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');

    try {
        console.log("Ejecutando MuebleService.updateImages");

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        const response = await fetch(`${BASE_URL}/muebleImagenes/${muebleId}`, {
            method: 'PUT', // Usamos el método PUT para actualizar
            body: formData // Enviamos los archivos en el cuerpo de la solicitud
        });

        // Verificamos si la solicitud fue exitosa
        if (!response.ok) {
            // Si hay un error, lanzamos una excepción con los detalles del error
            const errorText = await response.text();
            throw new Error(`Error al actualizar las imágenes: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
        }

        // Si todo salió bien, retornamos un mensaje de éxito
        return 'Imágenes actualizadas correctamente';
    } catch (error) {
        // Si ocurre algún error durante el proceso, lo registramos y lanzamos una excepción
        console.error('Error al actualizar las imágenes:', error);
        throw new Error('Error al actualizar las imágenes');
    }
}


}