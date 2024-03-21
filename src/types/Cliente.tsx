import { Domicilio } from "./Domicilio";

export interface Cliente {
    id: number;
    nombreCliente: string;
    apellidoCliente: string;
    telefonoCliente: number;
    mailCliente: string;
    fechaHoraAltaCliente: string;
    fechaHoraModificacionCliente: string | null;
    fechaHoraBajaCliente: string | null;
    estadoCliente: string | null;
    
    //Relaciones
    domicilioList: Domicilio[];
 }