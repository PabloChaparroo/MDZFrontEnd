import { CrearConsultaPayload, CrearConsultaResponse } from "../types/Consulta";

const BASE_URL = 'http://localhost:8081'

export const ConsultaService = {
    crearConsulta: async (payload: CrearConsultaPayload): Promise<CrearConsultaResponse> => {
        const response = await fetch(`${BASE_URL}/api/v1/consultas/crear`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al enviar la consulta: ${response.status} ${response.statusText}. ${errorText}`);
        }

        return response.json();
    }
}
