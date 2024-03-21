import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logoCopia+.png'; 
import '../Header/Header.css'; 

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <Navbar expand="lg" variant="dark" className="bg-black">
      <Container >
        <div className="d-flex align-items-center justify-content-center ">
          <img
            src={logo}
            alt="MDZ MUEBLES"
            height="70"
            className="mr-5"
          />
          <Navbar.Brand onClick={() => navigate('/')} className="neon-text " style={{ marginLeft: '10px' }}>
            MDZ MUEBLES
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          
          <Nav className="ms-auto"> 
             
            <Nav.Link onClick={() => navigate('/')}className="text-white">Inicio</Nav.Link>
            
            <Nav.Link onClick={() => navigate('/catalogo')}className="text-white">Catálogo</Nav.Link>
            <Nav.Link onClick={() => navigate('/contacto')}className="text-white">Contacto</Nav.Link>
            <Nav.Link onClick={() => navigate('/mueblesAMedida')}className="text-white">Muebles a Medida</Nav.Link>
            <Nav.Link onClick={() => navigate('/soliciteSuPresupuesto')}className="text-white">Solicite su presupuesto</Nav.Link>
            <Nav.Link onClick={() => navigate('/administrador')}className="text-white">Administrador</Nav.Link>
          
          </Nav>
          
        </Navbar.Collapse>
      </Container>
      
        <Navbar expand="lg">
          
          <Nav>
            {!localStorage.getItem("token") && (
                <Button className="btn btn-danger" onClick={() => navigate("/registrarse")} >
                Registrarse
              </Button>
            )}
          </Nav>

          <Nav>

          {!localStorage.getItem("token") && (
                <Nav.Link onClick={() => navigate("/login")}>
                Iniciar sesión
              </Nav.Link>
          )}
            
          </Nav>
        </Navbar>
      
    </Navbar>
  );
};

export default Header;
