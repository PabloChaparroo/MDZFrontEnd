import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap"
import {useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
    return (
        <>
        <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand onClick={()=> navigate('/')}> MDZ MUEBLES</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={()=> navigate('/')}>Inicio</Nav.Link>
            <Nav.Link onClick={()=> navigate('/catalogo')}>Catalogo</Nav.Link>
            <Nav.Link onClick={()=> navigate('/contacto')}>Contacto</Nav.Link>
            <Nav.Link onClick={()=> navigate('/administrador')}>Administrador</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  
  
        </>
    )
}
export default Header