import { Modal } from "react-bootstrap";
import { Mueble } from "../../types/Mueble";

type VerMuebleModalProps = {
    show: boolean;
    onHide: () => void;
    mueble: Mueble;
};

const VerMuebleModal = ({ show, onHide, mueble }: VerMuebleModalProps) => {
    const imagenes = Array.isArray(mueble.imagenes) ? mueble.imagenes : [];
    const portada = imagenes.find((img) => img.esPortada) || imagenes[0] || null;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{mueble.nombreMueble}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {portada ? (
                    <img
                        src={`data:image/jpeg;base64,${portada.imagenes}`}
                        alt={mueble.nombreMueble}
                        style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8, marginBottom: 16 }}
                    />
                ) : (
                    <div className="text-center text-muted py-4 mb-3" style={{ background: "#f5f5f5", borderRadius: 8 }}>
                        Sin imagen
                    </div>
                )}
                <p><strong>Color:</strong> {mueble.colorMueble}</p>
                {mueble.categoria && <p><strong>Categoría:</strong> {mueble.categoria.nombreCategoria}</p>}
                <p><strong>Descripción:</strong> {mueble.descripcion}</p>
            </Modal.Body>
        </Modal>
    );
};

export default VerMuebleModal;
