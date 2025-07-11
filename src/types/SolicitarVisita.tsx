import { Cliente } from "./Cliente";
import { Mueble } from "./Mueble";

export interface SolicitarVisita{
    id: number,
    fechaHoraAltaSolicitarVisita: string | null,
    fechaHoraBajaSolicitarVisita: string | null,
    fechaHotaModificacionSolicitarVisita: string | null,
    consultaSolicitarVisita: string,
    estado?: string,

    mueble: Mueble | null,
    cliente: Cliente | null,
}