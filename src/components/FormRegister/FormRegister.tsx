import { useFormik } from "formik";
import * as yup from "yup";
import { Form, Modal } from "react-bootstrap";

import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthService } from "../../services/AuthServide";

const FormRegister: React.FC = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  {
    /*
  //almacenar las localidades que nos trae el servicio
  const [localidades, setLocalidades] = useState<Localidad[]>([]);

  
   //buscar las localidades
  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        const localidadesData = await LocalidadService.getAllLocalidades();
        setLocalidades(localidadesData);
      } catch (error) {
        console.error("Error al obtener las localidades", error);
      }
    };

    fetchLocalidades();
  }, []); */
  }

  // YUP - Esquema de validación
  const validationSchema = yup.object().shape({
    username: yup.string().required("Este campo es obligatorio"),
    password: yup.string().required("Este campo es obligatorio"),
    nombreCliente: yup.string().required("El nombre es obligatorio"),
    apellidoCliente: yup.string().required("El apellido es obligatorio"),
    telefonoCliente:  yup
    .number()
    .required("El nro del telefono es obligatorio")
    .integer("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),
    mailcliente: yup
      .string()
      .email("Formato de correo electrónico inválido")
      .required("Este campo es obligatorio"),
    calleDomicilio: yup.string().required("La calle es obligatorio"),
    nroCalleDomicilio: yup
      .number()
      .required("El nro de calle es obligatorio")
      .integer("Debe ser un número entero")
      .positive("Debe ser mayor a 0"),
    descripcionDomicilio: yup.string().required("La descripción es obligatorio"),
    localidadDomicilio: yup.string().required("La localidad es obligatorio"),
    provinciaDomicilio: yup.string().required("La provincia es obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      nombreCliente: "",
      apellidoCliente: "",
      telefonoCliente: 0,
      mailCliente: "",
      calleDomicilio: "",
      nroCalleDomicilio: 0,
      descripcionDomicilio: "",
      localidadDomicilio: "",
      provinciaDomicilio: "",
     
    },

    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        const token = await AuthService.register(values);
        console.log("Registro realizado. Token:", token);
        toast.success("Registro realizado");
        navigate("/");
      } catch (error) {
        console.error("Error al registrarse");
      }
    },
  });

  const handleHide = () => {
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleHide}
      centered
      backdrop="static"
      className="modal-xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrarse</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          {/* Form.Group para cada campo para dar de alta o modificar un producto */}
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              type="text"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(
                formik.errors.username && formik.touched.username
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(
                formik.errors.password && formik.touched.password
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="nombreCliente">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombreCliente"
              type="text"
              value={formik.values.nombreCliente}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.nombreCliente && formik.touched.nombreCliente)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.nombreCliente}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="apellidoCliente">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              name="apellidoCliente"
              type="text"
              value={formik.values.apellidoCliente}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(
                formik.errors.apellidoCliente && formik.touched.apellidoCliente
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.apellidoCliente}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="telefonoCliente">
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              name="telefonoCliente"
              type="number"
              value={formik.values.telefonoCliente}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(
                formik.errors.telefonoCliente && formik.touched.telefonoCliente
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.telefonoCliente}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="mailCliente">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="mailCliente"
              type="text"
              value={formik.values.mailCliente}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.mailCliente && formik.touched.mailCliente)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.mailCliente}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="calleDomicilio">
            <Form.Label>Calle</Form.Label>
            <Form.Control
              name="calleDomicilio"
              type="text"
              value={formik.values.calleDomicilio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.calleDomicilio && formik.touched.calleDomicilio)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.calleDomicilio}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="nroCalleDomicilio">
            <Form.Label>Numero de Calle</Form.Label>
            <Form.Control
              name="nroCalleDomicilio"
              type="number"
              value={formik.values.nroCalleDomicilio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(
                formik.errors.nroCalleDomicilio && formik.touched.nroCalleDomicilio
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.nroCalleDomicilio}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="descripcionDomicilio">
            <Form.Label>Descripción del lugar de recidencia</Form.Label>
            <Form.Control
              name="descripcionDomicilio"
              type="text"
              value={formik.values.descripcionDomicilio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(
                formik.errors.descripcionDomicilio && formik.touched.descripcionDomicilio
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.descripcionDomicilio}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="localidadDomicilio">
            <Form.Label>Localidad</Form.Label>
            <Form.Control
              name="localidadDomicilio"
              type="text"
              value={formik.values.localidadDomicilio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(
                formik.errors.localidadDomicilio && formik.touched.localidadDomicilio
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.localidadDomicilio}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="provinciaDomicilio">
            <Form.Label>Provincia</Form.Label>
            <Form.Control
              name="provinciaDomicilio"
              type="text"
              value={formik.values.provinciaDomicilio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(
                formik.errors.provinciaDomicilio && formik.touched.provinciaDomicilio
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.provinciaDomicilio}
            </Form.Control.Feedback>
          </Form.Group>
         
          <Modal.Footer className="mt-4">
            <Button variant="secondary" onClick={handleHide}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid}>
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormRegister;