import { useFormik } from "formik";
import * as yup from "yup";
import { Form, Modal } from "react-bootstrap";

import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthService } from "../../services/AuthService";

const FormRegister: React.FC = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

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
    mailCliente: yup.string().email("Formato de correo electrónico inválido").required("Este campo es obligatorio"),
    
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      nombreCliente: "",
      apellidoCliente: "",
      telefonoCliente: 0,
      mailCliente: "",
      
     
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
      
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar</Modal.Title>
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