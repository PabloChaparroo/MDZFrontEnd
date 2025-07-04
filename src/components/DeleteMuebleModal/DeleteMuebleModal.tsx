import { Button, Form, Modal, Table } from "react-bootstrap";

//Dependencias para validar los formularios
import { ModalType } from "../../types/ModalType";
import { Mueble } from "../../types/Mueble";


//Recibe parametros como props para que se renderice, su titulo y según qué operación queremos realizar.
type MuebleModalProps = {
    show: boolean;
    onHide: () => void;
    nombre: string;
    modalType: ModalType;
    prod: Mueble;
  }

  const MuebleModal = ({show, onHide , nombre, modalType, prod}:MuebleModalProps) =>{
    return(
        <>
        { modalType === ModalType.DELETE ? (
            <> vacio</>
        ) : (
            <>
      <Modal show={show} onHide={onHide} centered backdrop="static">

      <Modal.Header closeButton>
        <Modal.Title>{nombre}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p> ¿Está seguro que desea eliminar el producto  
            
        </p>
      </Modal.Body>

      </Modal>
        </>
    )}
  </>
    )
        }
  export default MuebleModal
