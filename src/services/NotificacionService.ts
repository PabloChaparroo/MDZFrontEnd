import { AuthService } from "./AuthService";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface DestinatarioNotificacion {
  id: number;
  mail: string;
  fechaAlta: string;
}

export interface ListaDestinatarios {
  destinatarios: DestinatarioNotificacion[];
  /** true si no hay casillas cargadas y los avisos van a la casilla de respaldo del servidor */
  usaRespaldo: boolean;
}

/** Saca el mensaje de error que manda el backend (o uno genérico). */
async function mensajeDeError(response: Response, porDefecto: string): Promise<string> {
  try {
    const body = await response.json();
    return body.error || body.message || porDefecto;
  } catch {
    return porDefecto;
  }
}

/** Casillas que reciben el aviso de cada consulta nueva (solo admin). */
export const NotificacionService = {
  listar: async (): Promise<ListaDestinatarios> => {
    const response = await AuthService.fetchWithAuth(`${BASE_URL}/api/v1/notificaciones`, { method: 'GET' });
    if (!response.ok) throw new Error(await mensajeDeError(response, 'No se pudieron cargar las casillas'));
    return response.json();
  },

  agregar: async (mail: string): Promise<DestinatarioNotificacion> => {
    const response = await AuthService.fetchWithAuth(`${BASE_URL}/api/v1/notificaciones`, {
      method: 'POST',
      body: JSON.stringify({ mail }),
    });
    if (response.status === 409) throw new Error('Ese mail ya está en la lista');
    if (response.status === 400) throw new Error('El mail no es válido');
    if (!response.ok) throw new Error(await mensajeDeError(response, 'No se pudo agregar el mail'));
    return response.json();
  },

  quitar: async (id: number): Promise<void> => {
    const response = await AuthService.fetchWithAuth(`${BASE_URL}/api/v1/notificaciones/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await mensajeDeError(response, 'No se pudo quitar el mail'));
  },

  enviarPrueba: async (id: number): Promise<string> => {
    const response = await AuthService.fetchWithAuth(`${BASE_URL}/api/v1/notificaciones/${id}/prueba`, { method: 'POST' });
    if (!response.ok) throw new Error(await mensajeDeError(response, 'No se pudo enviar el mail de prueba'));
    const body = await response.json();
    return body.mensaje;
  },
};
