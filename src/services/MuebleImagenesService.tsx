import { MuebleImagenes } from "../types/MuebleImagenes";


const BASE_URL = 'http://localhost:8080'

export  const MuebleImagenesService = {
    //metodos
    getAllMuebleImagenes: async (): Promise<MuebleImagenes[]> => {
        const response = await fetch(`${BASE_URL}/api/v1/muebleImagenes `);
        const data = await response.json();

        return data;
    },

    getMuebleImagenes: async (id: number): Promise <MuebleImagenes> => {
        const response = await fetch(`${BASE_URL}/api/v1/muebleImagenes/${id}`);
        const data = await response.json();
        return data;
    },

   
    
    

    updateMueble: async (id: number, muebleImagenes: MuebleImagenes): Promise<MuebleImagenes> => {
        const response = await fetch(`${BASE_URL}/api/v1/muebleImagenes/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(muebleImagenes)
        });

        const data = await response.json();
        return data;
    },
    deleteMueble: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/v1/muebleImagenes/${id}`, {
            method: "DELETE"
        });
    },
// Método para subir imágenes al servidor
createImagenes: async (files: FileList, muebleId: number): Promise<string> => {
    try {
        console.log("Ejecutando el servidor crear");
        const formData = new FormData();
        //Agregar archivo al formulario
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        const response = await fetch(`${BASE_URL}/api/v1/muebleImagenes/imagenes${muebleId}`, { // Se incluye el ID del mueble en la URL
            method: 'POST',
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
}
,
// Método para actualizar imágenes en el servidor
updateImagenes: async (muebleId: number, files: FileList): Promise<string> => {
    try {
        console.log("Ejecutando MuebleService.updateImages");

        // Creamos un objeto FormData para enviar los archivos
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        // Hacemos la solicitud de actualización de imágenes al servidor
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