import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logoMZD.png'; 
import '../Header/Header.css'; 
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Cargar Font Awesome 6 y Google Fonts
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    const googleFonts = document.createElement('link');
    googleFonts.rel = 'stylesheet';
    googleFonts.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap';
    document.head.appendChild(googleFonts);

    // Efecto de scroll mejorado
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const shouldHideTopbar = scrollTop > 80;
      setIsScrolled(shouldHideTopbar);
      
      // Aplicar clase al body para ajustar el padding
      if (shouldHideTopbar) {
        document.body.classList.add('topbar-hidden');
      } else {
        document.body.classList.remove('topbar-hidden');
      }
    };

    // Agregar el listener de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup function
    return () => {
      if (document.head.contains(fontAwesomeLink)) {
        document.head.removeChild(fontAwesomeLink);
      }
      if (document.head.contains(googleFonts)) {
        document.head.removeChild(googleFonts);
      }
      window.removeEventListener('scroll', handleScroll);
      // Limpiar clase del body
      document.body.classList.remove('topbar-hidden');
    };
  }, []);

  // Función para determinar si un enlace está activo
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Topbar Profesional */}
      <div className={`header-topbar d-none d-lg-block ${isScrolled ? 'hidden' : ''}`}>
        <Container>
          <div className="topbar-content">
            <div className="topbar-contact">
              <p>
                <i className="fas fa-envelope"></i>
                info@mdzmuebles.com
              </p>
              <p>
                <i className="fas fa-phone-alt"></i>
                +54 261 123 4567
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i>
                Mendoza, Argentina
              </p>
            </div>
            
            <div className="topbar-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              
              {!localStorage.getItem("token") && (
                <Button 
                  onClick={() => navigate("/login")} 
                  className="login-btn"
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Iniciar sesión
                </Button>
              )}
            </div>
          </div>
        </Container>
      </div>
      {/* End Topbar */}

      {/* Navbar Principal Ultra Moderno */}
      <Navbar 
        expand="lg" 
        variant="dark" 
        className={`main-navbar ${isScrolled ? 'navbar-top' : ''}`}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          display: 'block',
          visibility: 'visible',
          opacity: 1,
          top: isScrolled ? '0px' : '48px' // Dinámicamente ajustar la posición
        }}
      >
        <Container className="navbar-container">
          {/* Logo y Marca */}
          <Link to="/" className="brand-container">
            <img 
              src={logo}
              alt="MDZ MUEBLES Logo"
              className="brand-logo"
            />
            <span className="brand-text">MDZ MUEBLES</span>
          </Link>
          
          {/* Hamburger Menu Animado */}
          <Navbar.Toggle 
            aria-controls="navbarSupportedContent"
            className="navbar-toggler"
          >
            <div className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </Navbar.Toggle>
          
          {/* Navegación */}
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="navbar-nav">
              <Link 
                to="/" 
                className={`nav-link-modern ${isActiveLink('/') ? 'active' : ''}`}
              >
                <i className="fas fa-home"></i>
                Inicio
              </Link>
              
              <Link 
                to="/catalogo" 
                className={`nav-link-modern ${isActiveLink('/catalogo') ? 'active' : ''}`}
              >
                <i className="fas fa-couch"></i>
                Catálogo
              </Link>
             
              <Link 
                to="/quienesSomos" 
                className={`nav-link-modern ${isActiveLink('/quienesSomos') ? 'active' : ''}`}
              >
                <i className="fas fa-users"></i>
                Nosotros
              </Link>
              
              <Link 
                to="/administrarCategorias" 
                className={`nav-link-modern ${isActiveLink('/administrarCategorias') ? 'active' : ''}`}
              >
                <i className="fas fa-cogs"></i>
                Admin Categorías
              </Link>
              
              <Link 
                to="/administrarSolicitud" 
                className={`nav-link-modern ${isActiveLink('/administrarSolicitud') ? 'active' : ''}`}
              >
                <i className="fas fa-clipboard-list"></i>
                Admin Solicitudes
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* End Navbar */}
    </>
  );
};

export default Header;
