import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { ConsultaService } from "../../services/ConsultaService";
import { Consulta } from "../../types/Consulta";

type ResponderConsultaModalProps = {
    show: boolean;
    onHide: () => void;
    consulta: Consulta;
    onRespondida: () => void;
};

const ResponderConsultaModal = ({ show, onHide, consulta, onRespondida }: ResponderConsultaModalProps) => {
    const [respuesta, setRespuesta] = useState(consulta.respuesta || "");
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!respuesta.trim()) return;

        setIsSending(true);
        try {
            await ConsultaService.responderConsulta(consulta.id, respuesta.trim());
            toast.success(`Respuesta enviada a ${consulta.cliente?.mailCliente}`);
            onRespondida();
            onHide();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "No se pudo enviar la respuesta");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Responder consulta #{consulta.id}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <p className="mb-1">
                        <strong>{consulta.cliente?.nombreCliente} {consulta.cliente?.apellidoCliente}</strong>
                        {" "}({consulta.cliente?.mailCliente})
                    </p>
                    <p className="text-muted" style={{ fontStyle: "italic" }}>"{consulta.mensajeConsulta}"</p>

                    <Form.Group controlId="formRespuesta" className="mt-3">
                        <Form.Label>Tu respuesta</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Escribí la respuesta que le vamos a mandar por mail al cliente..."
                            value={respuesta}
                            onChange={(e) => setRespuesta(e.target.value)}
                            required
                            disabled={isSending}
                        />
                        <Form.Text className="text-muted">
                            Se envía por mail a {consulta.cliente?.mailCliente} y queda guardada en la consulta.
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={isSending}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSending || !respuesta.trim()}>
                        {isSending ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane me-2"></i>
                                Enviar respuesta
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ResponderConsultaModal;
