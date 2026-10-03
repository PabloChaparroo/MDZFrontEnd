import { Link } from 'react-router-dom';
import logo from '../../assets/images/logoMZD.png';
import '../../styles/mdz-theme.css';
import '../../styles/mdz-site.css';

function Footer() {
  return (
    <footer className="mdz-footer">
      <div className="mdz-container mdz-footer-inner">
        <Link to="/" className="mdz-brand" aria-label="MDZ Muebles, inicio">
          <img src={logo} alt="MDZ Muebles" />
          <span>MDZ MUEBLES<small>Diseño &amp; carpintería a medida</small></span>
        </Link>
        <p>&copy; {new Date().getFullYear()} MDZ Muebles · Hecho con oficio, pensado para vos.</p>
        <Link className="mdz-footer-link" to="/catalogo">
          Ver catálogo <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
