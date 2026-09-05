import { useState } from "react";
import { Badge, Button, Carousel, Modal } from "react-bootstrap";
import { CatalogoMueble } from "../../types/CatalogoMueble";
import ConsultaFormModal from "./ConsultaFormModal";

type MuebleDetalleModalProps = {
    show: boolean;
    onHide: () => void;
    mueble: CatalogoMueble;
}

const MuebleDetalleModal = ({ show, onHide, mueble }: MuebleDetalleModalProps) => {
    const [showConsulta, setShowConsulta] = useState(false);

    const imagenes = mueble.imagenes && mueble.imagenes.length > 0
        ? mueble.imagenes
        : (mueble.imagenPortada ? [{ id: 0, imagenes: mueble.imagenPortada, esPortada: true }] : []);

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{mueble.nombreMueble}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {imagenes.length > 0 ? (
                        <Carousel variant="dark" interval={null}>
                            {imagenes.map((img) => (
                                <Carousel.Item key={img.id}>
                                    <img
                                        className="d-block w-100"
                                        style={{ maxHeight: "420px", objectFit: "cover", borderRadius: "8px" }}
                                        src={`data:image/jpeg;base64,${img.imagenes}`}
                                        alt={mueble.nombreMueble}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ) : (
                        <div className="text-center text-muted py-5">Este mueble todavía no tiene imágenes cargadas</div>
                    )}

                    <div className="mt-3 d-flex gap-2 align-items-center flex-wrap">
                        {mueble.nombreCategoria && <Badge bg="secondary">{mueble.nombreCategoria}</Badge>}
                        {mueble.colorMueble && <Badge bg="light" text="dark">Color: {mueble.colorMueble}</Badge>}
                    </div>

                    <p className="mt-3">{mueble.descripcion}</p>

                    <p className="text-muted small mb-0">
                        Este es un mueble a medida: las dimensiones, terminaciones y precio se definen a partir de tu consulta.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cerrar</Button>
                    <Button variant="primary" onClick={() => setShowConsulta(true)}>
                        Consultar por este mueble
                    </Button>
                </Modal.Footer>
            </Modal>

            {showConsulta && (
                <ConsultaFormModal
                    show={showConsulta}
                    onHide={() => setShowConsulta(false)}
                    mueble={mueble}
                />
            )}
        </>
    );
};

export default MuebleDetalleModal;
