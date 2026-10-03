import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../../assets/images/logoMZD.png';
import { useMdzTheme } from '../../hooks/useMdzTheme';
import '../../styles/mdz-theme.css';
import '../../styles/mdz-site.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { light, toggleTheme } = useMdzTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);
    return () => {
      if (document.head.contains(fontAwesomeLink)) {
        document.head.removeChild(fontAwesomeLink);
      }
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isLoggedIn = !!localStorage.getItem('token');
  const isActive = (path: string) => location.pathname === path;

  const go = (to: string) => {
    navigate(to);
    setMenuOpen(false);
  };

  return (
    <header className="mdz-site-header">
      <div className="mdz-container">
        <Link to="/" className="mdz-brand" aria-label="MDZ Muebles, inicio">
          <img src={logo} alt="MDZ Muebles" />
          <span>MDZ MUEBLES<small>Diseño &amp; carpintería a medida</small></span>
        </Link>

        <nav className="mdz-nav" aria-label="Navegación principal">
          <span className={isActive('/') ? 'mdz-nav-active' : ''} onClick={() => go('/')}>Inicio</span>
          <span className={isActive('/catalogo') ? 'mdz-nav-active' : ''} onClick={() => go('/catalogo')}>Catálogo</span>
          <span className={isActive('/quienesSomos') ? 'mdz-nav-active' : ''} onClick={() => go('/quienesSomos')}>El taller</span>
          {isLoggedIn && (
            <>
              <span className={isActive('/perfil') ? 'mdz-nav-active' : ''} onClick={() => go('/perfil')}>Mi perfil</span>
              <span className={isActive('/administrarCategorias') ? 'mdz-nav-active' : ''} onClick={() => go('/administrarCategorias')}>Admin categorías</span>
              <span className={isActive('/administrarSolicitud') ? 'mdz-nav-active' : ''} onClick={() => go('/administrarSolicitud')}>Admin consultas</span>
            </>
          )}
        </nav>

        <div className="mdz-header-actions">
          <button
            className="mdz-btn mdz-btn-nav mdz-btn-icon"
            onClick={toggleTheme}
            aria-label={light ? 'Activar modo oscuro' : 'Activar modo claro'}
            title={light ? 'Modo oscuro' : 'Modo claro'}
          >
            <i className={`fas ${light ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>

          {isLoggedIn ? (
            <button className="mdz-btn mdz-btn-brand mdz-header-cta" onClick={() => go('/perfil')}>
              <i className="fas fa-user-circle"></i> Mi perfil
            </button>
          ) : (
            <button className="mdz-btn mdz-btn-brand mdz-header-cta" onClick={() => go('/login')}>
              Iniciar sesión <i className="fas fa-arrow-up-right-from-square"></i>
            </button>
          )}

          <button
            className="mdz-btn mdz-btn-nav mdz-btn-icon mdz-mobile-toggle"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <i className={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mdz-mobile-nav" aria-label="Navegación móvil">
          <span onClick={() => go('/')}>Inicio</span>
          <span onClick={() => go('/catalogo')}>Catálogo</span>
          <span onClick={() => go('/quienesSomos')}>El taller</span>
          {isLoggedIn ? (
            <>
              <span onClick={() => go('/perfil')}>Mi perfil</span>
              <span onClick={() => go('/administrarCategorias')}>Admin categorías</span>
              <span onClick={() => go('/administrarSolicitud')}>Admin consultas</span>
            </>
          ) : (
            <span onClick={() => go('/login')}>Iniciar sesión</span>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
