import {Domicilio} from '../types/Domicilio';

export interface ClienteDTO {
    username: string,
    id: number,
    nombreCliente: string,
    apellidoCliente: string,
    telefonoCliente: number,
    mailCliente: string,
    fechaHoraModificacionCliente: string,
    domicilioList: Domicilio[],
}