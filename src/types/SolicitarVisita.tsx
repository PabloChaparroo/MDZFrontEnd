import { Cliente } from "./Cliente";
import { Mueble } from "./Mueble";

export interface SolicitarVisita{
    id: number,
    fechaHoraAltaSolicitarVisita: string | null,
    fechaHoraBajaSolicitarVisita: string | null,
    consultaSolicitarVisita: string,

    mueble: Mueble | null,
    cliente: Cliente | null,
}