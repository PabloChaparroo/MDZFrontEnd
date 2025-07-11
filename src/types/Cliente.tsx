

export interface Cliente {
    id: number;
    nombreCliente: string;
    apellidoCliente: string;
    telefonoCliente: number | null;
    mailCliente: string;
    fechaHoraAltaCliente: string | null;
    fechaHoraModificacionCliente: string | null;
    fechaHoraBajaCliente: string | null;
    estadoCliente: string | null;

 }