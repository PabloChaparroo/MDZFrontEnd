import { useEffect, useState } from "react"
import { SolicitarVisitaService } from "../../services/SolicitarVisitaService"
import { SolicitarVisita } from "../../types/SolicitarVisita"
import { Button, Table } from "react-bootstrap";



const AdministrarSolicitud = () => {

    const [solicitarVisita, setSolicitarVisita] = useState<SolicitarVisita[]>([]);

   useEffect(() =>{
    const fetchSolicitarVisita = async()=>{
        const solicitarVisita = await SolicitarVisitaService.getUltimos30Solicitudes();
        setSolicitarVisita(solicitarVisita.reverse());
    }
    fetchSolicitarVisita();
   },[]);


   const handleClickVerSolicitud = () => {
                 
                  
   };

  return (
    <>
    
<Button className='category-text bg-black' onClick={() => handleClickVerSolicitud()}>
        Solicitudes 
</Button>
<Button className='category-text bg-black' onClick={() => handleClickVerSolicitud()}>
        Lista de clientes
</Button>
<Button className='category-text bg-black' onClick={() => handleClickVerSolicitud()}>
        Ranking 
</Button>
<Button className='category-text bg-black' onClick={() => handleClickVerSolicitud()}>
        Consultas
</Button>
    <div style={{ overflowX: "auto" }}>
      <Table hover>
          <thead>
            <tr>
              <th>ID</th>
             
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>FECHA CREACION DEL CLIENTE</th>
              <th>MAIL</th>
              <th>TELÉFONO</th>
              <th>CONSULTA</th>
              <th>MUEBLE</th>
              <th>PRECIO</th>
            </tr>
          </thead>
          <tbody>
            {solicitarVisita.map((solicitarVisita) => (
              <tr key={solicitarVisita.id}>
                <td>{solicitarVisita.id}</td>
               
                <td>{solicitarVisita.cliente?.nombreCliente}</td>
                <td>{solicitarVisita.cliente?.apellidoCliente}</td>
                <td>{solicitarVisita.cliente?.fechaHoraAltaCliente}</td>
                <td>{solicitarVisita.cliente?.mailCliente}</td>
                <td>{solicitarVisita.cliente?.telefonoCliente}</td>
                <td>{solicitarVisita.consultaSolicitarVisita}</td>
                <td>{solicitarVisita.mueble?.nombreMueble}</td>
                <td>{solicitarVisita.mueble?.precio}</td>
                {/*<td><EditButton onClick={() => handleClickCategoriaButton("Editar categoria", categoria, ModalType.UPDATE)}/></td>
                <td><DeleteButton onClick={() => handleClickCategoriaButton("Borrar categoria", categoria, ModalType.DELETE)}/></td>*/}
                
              </tr>
            ))}
          </tbody>
        </Table>
    </div>
    </>)
}

export default AdministrarSolicitud
