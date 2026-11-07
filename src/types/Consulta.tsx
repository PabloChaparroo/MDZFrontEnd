import { Cliente } from "./Cliente";
import { Mueble } from "./Mueble";

export interface Consulta {
    id: number,
    fechaHoraAltaConsulta: string | null,
    fechaHoraModificacionConsulta: string | null,
    mensajeConsulta: string,
    respuesta: string | null,

    // null = consulta general (sin mueble puntual, ej. formulario de contacto de la home)
    mueble: Mueble | null,
    cliente: Cliente | null,
}
