import { Button, Form, FormLabel, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { ConsultaService } from "../../services/ConsultaService";
import { CatalogoMueble } from "../../types/CatalogoMueble";

type ConsultaFormModalProps = {
    show: boolean;
    onHide: () => void;
    mueble: CatalogoMueble;
}

const validationSchema = Yup.object().shape({
    nombreCliente: Yup.string().required("El nombre es requerido"),
    apellidoCliente: Yup.string().required("El apellido es requerido"),
    telefonoCliente: Yup.number()
        .typeError("El teléfono debe ser un número")
        .positive("El teléfono no es válido")
        .integer("El teléfono no es válido")
        .required("El teléfono es requerido"),
    mailCliente: Yup.string().email("El email no es válido").required("El email es requerido"),
    mensajeConsulta: Yup.string().required("Contanos qué querés consultar").min(5, "Contanos un poco más"),
});

const ConsultaFormModal = ({ show, onHide, mueble }: ConsultaFormModalProps) => {
    const formik = useFormik({
        initialValues: {
            nombreCliente: "",
            apellidoCliente: "",
            telefonoCliente: "",
            mailCliente: "",
            mensajeConsulta: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                await ConsultaService.crearConsulta({
                    cliente: {
                        nombreCliente: values.nombreCliente,
                        apellidoCliente: values.apellidoCliente,
                        telefonoCliente: Number(values.telefonoCliente),
                        mailCliente: values.mailCliente,
                    },
                    muebleId: mueble.id,
                    mensajeConsulta: values.mensajeConsulta,
                });
                toast.success("¡Consulta enviada! Te vamos a contactar a la brevedad.", {
                    position: "top-center",
                });
                resetForm();
                onHide();
            } catch (error) {
                console.error(error);
                toast.error("No pudimos enviar tu consulta. Probá de nuevo.");
            }
        },
    });

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Consultar por "{mueble.nombreMueble}"</Modal.Title>
            </Modal.Header>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formNombreCliente">
                        <FormLabel>Nombre</FormLabel>
                        <Form.Control
                            name="nombreCliente"
                            type="text"
                            value={formik.values.nombreCliente}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid={Boolean(formik.errors.nombreCliente && formik.touched.nombreCliente)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.nombreCliente}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formApellidoCliente">
                        <FormLabel>Apellido</FormLabel>
                        <Form.Control
                            name="apellidoCliente"
                            type="text"
                            value={formik.values.apellidoCliente}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid={Boolean(formik.errors.apellidoCliente && formik.touched.apellidoCliente)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.apellidoCliente}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formTelefonoCliente">
                        <FormLabel>Teléfono</FormLabel>
                        <Form.Control
                            name="telefonoCliente"
                            type="tel"
                            value={formik.values.telefonoCliente}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid={Boolean(formik.errors.telefonoCliente && formik.touched.telefonoCliente)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.telefonoCliente}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMailCliente">
                        <FormLabel>Email</FormLabel>
                        <Form.Control
                            name="mailCliente"
                            type="email"
                            value={formik.values.mailCliente}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid={Boolean(formik.errors.mailCliente && formik.touched.mailCliente)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.mailCliente}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMensajeConsulta">
                        <FormLabel>Tu consulta</FormLabel>
                        <Form.Control
                            name="mensajeConsulta"
                            as="textarea"
                            rows={3}
                            placeholder="Contanos qué medidas, colores o detalles te interesan..."
                            value={formik.values.mensajeConsulta}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid={Boolean(formik.errors.mensajeConsulta && formik.touched.mensajeConsulta)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.mensajeConsulta}</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                        Enviar consulta
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ConsultaFormModal;
