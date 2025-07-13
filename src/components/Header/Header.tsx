import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logoMZD.png'; 
import '../Header/Header.css'; 
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  // const isDesktop = useIsDesktop();

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

    // Agregar los listeners
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

  const isLoggedIn = !!localStorage.getItem('token');
  
  // Estado para controlar el menú desplegable en mobile
  const [expanded, setExpanded] = useState(false);

  // Cierra el menú cuando se navega a una página
  const handleNavClick = (to: string) => {
    navigate(to);
    setExpanded(false);
  };

  return (
    <>
      {/* Topbar Profesional */}
      <div className={`header-topbar ${isScrolled ? 'hidden' : ''}`}>
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
              <a href="https://www.facebook.com/Esteban.Chaparro028" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/mdz.muebles/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://wa.me/542613663197" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>

              <div className="d-flex align-items-center">
                {isLoggedIn ? (
                  <>
                    {/* Botón Mi Perfil - Amarillo dorado como el login */}
                    <button
                      onClick={() => navigate('/perfil')}
                      style={{
                        background: 'linear-gradient(45deg, #FFD700, #FFC600)',
                        border: '2px solid #B8860B',
                        color: '#2c3e50',
                        padding: '8px 20px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginRight: '15px',
                        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                        transition: 'all 0.3s ease',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                        letterSpacing: '0.5px'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(-2px) scale(1.05)';
                        (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)';
                        (e.target as HTMLElement).style.background = 'linear-gradient(45deg, #FFEF00, #FFD700)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(0) scale(1)';
                        (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
                        (e.target as HTMLElement).style.background = 'linear-gradient(45deg, #FFD700, #FFC600)';
                      }}
                    >
                      <i className="fas fa-user-circle me-2"></i>
                      Mi Perfil
                    </button>
                  </>
                ) : (
                  <Button onClick={() => navigate('/login')} className="login-btn">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Iniciar sesión
                  </Button>
                )}
              </div>
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
        expanded={expanded}
        onToggle={setExpanded}
        /* Sin style, todo lo maneja el CSS */
      >
        <Container className="navbar-container">
          {/* Logo y Marca */}
          <Link to="/" className="brand-container" onClick={() => handleNavClick('/') }>
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
              <span onClick={() => handleNavClick('/')} className={`nav-link-modern ${isActiveLink('/') ? 'active' : ''}`} style={{cursor:'pointer'}}>
                <i className="fas fa-home"></i>
                Inicio
              </span>
              
              <span onClick={() => handleNavClick('/catalogo')} className={`nav-link-modern ${isActiveLink('/catalogo') ? 'active' : ''}`} style={{cursor:'pointer'}}>
                <i className="fas fa-couch"></i>
                Catálogo
              </span>
             
              <span onClick={() => handleNavClick('/quienesSomos')} className={`nav-link-modern ${isActiveLink('/quienesSomos') ? 'active' : ''}`} style={{cursor:'pointer'}}>
                <i className="fas fa-users"></i>
                Nosotros
              </span>
              
              {/* Solo mostrar enlaces de admin si el usuario está logueado */}
              {isLoggedIn && (
                <>
                  <span onClick={() => handleNavClick('/perfil')} className={`nav-link-modern ${isActiveLink('/perfil') ? 'active' : ''} d-lg-none`} style={{cursor:'pointer'}}>
                    <i className="fas fa-user-cog"></i>
                    Mi Perfil
                  </span>
                  
                  <span onClick={() => handleNavClick('/administrarCategorias')} className={`nav-link-modern ${isActiveLink('/administrarCategorias') ? 'active' : ''}`} style={{cursor:'pointer'}}>
                    <i className="fas fa-cogs"></i>
                    Admin Categorías
                  </span>
                  
                  <span onClick={() => handleNavClick('/administrarSolicitud')} className={`nav-link-modern ${isActiveLink('/administrarSolicitud') ? 'active' : ''}`} style={{cursor:'pointer'}}>
                    <i className="fas fa-clipboard-list"></i>
                    Admin Solicitudes
                  </span>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* End Navbar */}
    </>
  );
};

export default Header;
