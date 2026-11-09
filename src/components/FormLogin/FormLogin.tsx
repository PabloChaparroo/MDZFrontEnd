import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import './FormLogin.css'; // Archivo CSS que crearemos después
import { AuthService } from "../../services/AuthService";

const FormLogin: React.FC = () => {
  const navigate = useNavigate();
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // YUP - Esquema de validación
  const validationSchema = Yup.object({
    username: Yup.string().required("El nombre de usuario es requerido"),
    password: Yup.string().required("La contraseña es requerida"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
  try {
    const token = await AuthService.login(values);
    console.log("Inicio de sesión exitoso. Token:", token);
    navigate('/');
    toast.success('Inicio de sesión exitoso');
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 400 || status === 403) {
      toast.error("Correo o contraseña incorrectos.");
    } else {
      toast.error("Error al iniciar sesión. Intente nuevamente.");
    }
    console.error("Error al iniciar sesión:", error);
  }
},
  });

  return (
    <Container className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <Form onSubmit={formik.handleSubmit} className="login-form">
          {/* ----- username ----- */}
          <div className="mb-3 mt-1">
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="text-danger"> {formik.errors.username} </div>
            ) : null}
          </div>

          {/* ----- password ----- */}
          <div className="mb-3 mt-1">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="password-field">
              <input
                type={mostrarPassword ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                autoComplete="current-password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setMostrarPassword((v) => !v)}
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={mostrarPassword}
                title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <i className={mostrarPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger"> {formik.errors.password} </div>
            ) : null}
          </div>

          <div className="login-actions">
            {/* 
            <Button className="register-button" onClick={() => navigate("/registrarse")}>
              Registrar
            </Button>
            */}
            <Button className="login-button" variant="primary" type="submit">
              Enviar
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default FormLogin;
