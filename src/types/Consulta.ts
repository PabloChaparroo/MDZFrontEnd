export interface ClienteConsulta {
    nombreCliente: string;
    apellidoCliente: string;
    telefonoCliente: number;
    mailCliente: string;
}

export interface CrearConsultaPayload {
    cliente: ClienteConsulta;
    muebleId: number;
    mensajeConsulta: string;
}

export interface CrearConsultaResponse {
    mensaje: string;
    consultaId: number;
    clienteId: number;
    clienteNuevo: boolean;
}
