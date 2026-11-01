import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cocinaNegra from '../assets/images/cocina-portada.jpg';
import placar from '../assets/images/placar-portada.jpg';
import racks from '../assets/images/rack-Portada.jpg';
import fotoAbout from '../assets/images/fotoAbout.jpg';
import { CategoriaService } from "../services/CategoriaService";
import { ConsultaService } from "../services/ConsultaService";
import { MuebleService } from "../services/MuebleService";
import { Cliente } from "../types/Cliente";
import { Mueble } from "../types/Mueble";
import '../styles/mdz-theme.css';
import '../styles/mdz-site.css';

const heroImages = [cocinaNegra, placar, racks];

const steps = [
  { title: 'Nos contás tu idea', text: 'Escuchamos qué necesitás, cómo es tu espacio y qué tenés en mente.' },
  { title: 'Tomamos las medidas', text: 'Visitamos tu hogar para conocer el lugar y definir cada detalle.' },
  { title: 'Diseñamos la propuesta', text: 'Te compartimos un presupuesto con materiales y terminaciones.' },
  { title: 'Le damos forma', text: 'Creamos tu mueble a mano y coordinamos la entrega e instalación.' },
];

const benefits = [
  { icon: 'fa-hammer', text: 'Hecho a mano' },
  { icon: 'fa-leaf', text: 'Materiales naturales' },
  { icon: 'fa-ruler-combined', text: 'Diseñado a tu medida' },
  { icon: 'fa-truck', text: 'Entrega e instalación' },
];

function getPortadaSrc(mueble: Mueble): string | null {
  const portada = mueble.imagenPortada;
  if (!portada) return null;
  if (typeof portada === 'string') return `data:image/jpeg;base64,${portada}`;
  return `data:image/png;base64,${portada.imagenes}`;
}

const HomePage = () => {
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImgRef = useRef<HTMLImageElement | null>(null);

  // Catálogo destacado (datos reales)
  const [destacados, setDestacados] = useState<Mueble[]>([]);

  // Formulario de contacto general
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    consulta: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1));
    }, 5000);
    return () => clearInterval(imageInterval);
  }, []);

  // Reinicia la animación de fade sin recrear el <img> (ver commit previo:
  // usar key={currentImageIndex} hace que el navegador deje de renderizar
  // la imagen después de mucho tiempo).
  useEffect(() => {
    const el = heroImgRef.current;
    if (!el) return;
    el.classList.remove('mdz-hero-photo-fade');
    void el.offsetWidth;
    el.classList.add('mdz-hero-photo-fade');
  }, [currentImageIndex]);

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        // Un mueble por categoría, para que la portada muestre toda la variedad
        const categorias = await CategoriaService.getAllCategoria();
        const paginas = await Promise.all(
          categorias.slice(0, 12).map((c) => MuebleService.getCatalogoMueblesByCategoria(0, c.id))
        );
        const items = paginas
          .map((p) => (p.content || []).find((m) => getPortadaSrc(m)))
          .filter((m): m is Mueble => Boolean(m))
          .slice(0, 8);
        setDestacados(items);
      } catch (error) {
        console.error('Error al cargar destacados del catálogo:', error);
      }
    };
    fetchDestacados();
  }, []);

  // Aparición suave de cada bloque al entrar en pantalla
  useEffect(() => {
    const elementos = document.querySelectorAll('.mdz-reveal:not(.is-visible)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [destacados]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowErrorMessage(false);

    try {
      const nombreParts = formData.nombreCompleto.trim().split(' ');
      const nombre = nombreParts[0] || '';
      const apellido = nombreParts.slice(1).join(' ') || '';

      const cliente: Cliente = {
        id: 0,
        nombreCliente: nombre,
        apellidoCliente: apellido,
        mailCliente: formData.email,
        telefonoCliente: formData.telefono.trim() || null,
        fechaHoraAltaCliente: null,
        fechaHoraModificacionCliente: null,
        fechaHoraBajaCliente: null
      };

      await ConsultaService.crearConsulta({
        cliente,
        mensajeConsulta: formData.consulta
      });

      setShowSuccessMessage(true);
      setFormData({ nombreCompleto: '', email: '', telefono: '', consulta: '' });
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error) {
      console.error('Error al enviar consulta:', error);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mdz-home">
      {/* Hero */}
      <section className="mdz-hero">
        <img
          ref={heroImgRef}
          className="mdz-hero-photo mdz-hero-photo-fade"
          src={heroImages[currentImageIndex]}
          alt={`Mueble MDZ ${currentImageIndex + 1}`}
        />
        <div className="mdz-container mdz-home-hero-content">
          <p className="mdz-eyebrow">Hecho a mano en Mendoza</p>
          <h1>MDZ Muebles.<br />Muebles,<br /><span>A Medida</span></h1>
          <p className="mdz-hero-description">
            Muebles a medida que unen diseño, madera y oficio. Pensados para tu casa. Hechos para vivirlos.
          </p>
          <div className="mdz-home-hero-actions">
            <a href="#coleccion" className="mdz-btn mdz-btn-brand mdz-btn-lg">
              Descubrí nuestros muebles <i className="fas fa-arrow-down"></i>
            </a>
            <a href="#contacto" className="mdz-btn mdz-home-btn-ghost mdz-btn-lg">Pedí tu presupuesto</a>
          </div>
        </div>
        <div className="mdz-hero-bottom">
          <div className="mdz-container">
            <a className="mdz-hero-label" href="#coleccion">
              <i className="fas fa-chevron-down"></i> Diseño que se siente como hogar
            </a>
            <div className="mdz-home-dots">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={index === currentImageIndex ? 'is-active' : ''}
                  aria-label={`Ver foto ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mdz-benefits" aria-label="Nuestro compromiso">
        <div className="mdz-container mdz-benefits-inner">
          {benefits.map((b) => (
            <div className="mdz-benefit" key={b.text}>
              <i className={`fas ${b.icon}`}></i>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Catálogo destacado */}
      <section id="coleccion" className="mdz-container mdz-section">
        <div className="mdz-section-heading">
          <div>
            <p className="mdz-eyebrow">Piezas con personalidad</p>
            <h2>Un lugar para cada idea.</h2>
            <p className="mdz-section-copy">Elegí una inspiración. La hacemos tuya.</p>
          </div>
          <Link to="/catalogo" className="mdz-btn mdz-btn-filter">
            Ver todo el catálogo <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="mdz-home-grid">
          {destacados.map((mueble) => (
            <Link className="mdz-home-tile mdz-reveal" key={mueble.id} to={`/ViewMueble/${mueble.nombreMueble}`} state={{ mueble }}>
              <img src={getPortadaSrc(mueble) ?? undefined} alt={mueble.nombreMueble} loading="lazy" />
              <span className="mdz-home-tile-text">
                <small>{mueble.categoria?.nombreCategoria}</small>
                <strong>{mueble.nombreMueble}</strong>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="mdz-container mdz-section mdz-about">
        <div className="mdz-home-about-media mdz-reveal">
          <img className="mdz-about-image" src={fotoAbout} alt="Taller MDZ Muebles" loading="lazy" />
        </div>
        <div className="mdz-reveal">
          <p className="mdz-eyebrow">La esencia de nuestro taller</p>
          <h2>La madera es el comienzo.<br />Tu historia, el diseño.</h2>
          <p className="mdz-section-copy">
            Nos gustan las líneas simples, los materiales honestos y los detalles que hacen la diferencia.
            Pero, sobre todo, nos gusta crear muebles que tengan sentido para vos.
          </p>
          <p className="mdz-section-copy">
            Desde la primera idea hasta el último ensamble, acompañamos tu proyecto con la dedicación de lo hecho a mano.
          </p>
          <div className="mdz-about-signature">
            <i className="fas fa-map-marker-alt"></i>
            <span>Desde Mendoza, para tu hogar.</span>
          </div>
          <div style={{ marginTop: 20 }}>
            <Link to="/quienesSomos" className="mdz-btn mdz-btn-filter">
              Conocer el taller <i className="fas fa-arrow-up-right-from-square"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="mdz-section mdz-process">
        <div className="mdz-container">
          <div className="mdz-section-heading">
            <div>
              <p className="mdz-eyebrow">De la idea a tu hogar</p>
              <h2>Simple. Cercano. A tu medida.</h2>
            </div>
            <p className="mdz-section-copy">Vos lo imaginás. Nosotros lo creamos.</p>
          </div>
          <div className="mdz-process-grid">
            {steps.map((step, index) => (
              <div key={step.title} className="mdz-reveal">
                <div className="mdz-step-number">0{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="mdz-container mdz-section mdz-contact">
        <div>
          <p className="mdz-eyebrow">Empecemos por una charla</p>
          <h2>Tu próximo mueble<br />empieza con una idea.</h2>
          <p className="mdz-section-copy">
            Contanos qué tenés en mente.<br />Nos encantará darle forma con vos.
          </p>
          <div className="mdz-contact-links">
            <a href="mailto:info@mdzmuebles.com"><i className="fas fa-envelope"></i>info@mdzmuebles.com</a>
            <span><i className="fas fa-map-marker-alt"></i>Mendoza, Argentina</span>
          </div>
        </div>

        <form className="mdz-contact-form mdz-reveal" onSubmit={handleSubmit}>
          <label>
            Tu nombre
            <input name="nombreCompleto" placeholder="Nombre y apellido" value={formData.nombreCompleto} onChange={handleInputChange} required />
          </label>
          <label>
            Tu email
            <input name="email" type="email" placeholder="hola@ejemplo.com" value={formData.email} onChange={handleInputChange} required />
          </label>
          <label className="mdz-full-field">
            Teléfono (opcional)
            <input name="telefono" type="tel" placeholder="Código de área + número" value={formData.telefono} onChange={handleInputChange} />
          </label>
          <label className="mdz-full-field">
            ¿Qué necesitás?
            <textarea name="consulta" placeholder="Contanos tu idea, las medidas aproximadas y lo que necesitás…" value={formData.consulta} onChange={handleInputChange} required />
          </label>
          <button type="submit" className="mdz-btn mdz-btn-brand mdz-full-field mdz-btn-lg" disabled={isSubmitting} style={{ justifyContent: 'space-between' }}>
            {isSubmitting ? (
              <><i className="fas fa-spinner fa-spin"></i> Enviando...</>
            ) : (
              <>Enviar consulta <i className="fas fa-arrow-up-right-from-square"></i></>
            )}
          </button>
          {showSuccessMessage && (
            <p className="mdz-full-field mdz-form-feedback" role="status">
              ¡Consulta enviada! Nos pondremos en contacto con vos a la brevedad.
            </p>
          )}
          {showErrorMessage && (
            <p className="mdz-full-field mdz-form-feedback is-error" role="alert">
              Hubo un error al enviar tu consulta. Por favor, intentá nuevamente.
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default HomePage;
