import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; // Archivo de estilos CSS para personalizar el footer
import logoLocation from './assets/logos/location_on_FILL0_wght400_GRAD0_opsz24.png'; // Importar la imagen del logo de la localidad

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row className="border-top justify-content-between p-3 footer-content">
          <Col className="p-0 info-column" md={4} sm={12}>
            <h4>Contacto</h4>
            <div className="d-flex align-items-center">
              
              <div>
                <p>Dirección: Calle de los Muebles, 123</p>
                <p>Teléfono: +123 456 789</p>
                <p>Email: info@mueblescarpinteria.com</p>
              </div>
            </div>
          </Col>
          <Col className="p-0 d-flex justify-content-center" md={4}>
         
          </Col>
          <Col className="p-0 d-flex justify-content-center" md={4}>
            <p>&copy; {new Date().getFullYear()} Muebles Carpintería</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
