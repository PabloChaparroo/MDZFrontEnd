import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cocinaNegra from '../assets/images/cocinaUno.jpg';
import placar from '../assets/mdz-design/home-interior.jpg';
import racks from '../assets/images/racks.jpg';
import fotoAbout from '../assets/images/fotoAbout.jpg';
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
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

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
        const response = await MuebleService.getCatalogoMueblesAll(0);
        const items = (response.content || []).slice(0, 6);
        setDestacados(items);
        const nombresCategoria = Array.from(
          new Set(items.map((m) => m.categoria?.nombreCategoria).filter((c): c is string => Boolean(c)))
        );
        setCategorias(nombresCategoria);
      } catch (error) {
        console.error('Error al cargar destacados del catálogo:', error);
      }
    };
    fetchDestacados();
  }, []);

  const productosVisibles = categoriaActiva === 'Todos'
    ? destacados
    : destacados.filter((m) => m.categoria?.nombreCategoria === categoriaActiva);

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
        telefonoCliente: formData.telefono ? parseInt(formData.telefono) : 0,
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
    <>
      {/* Hero */}
      <section className="mdz-hero">
        <img
          ref={heroImgRef}
          className="mdz-hero-photo mdz-hero-photo-fade"
          src={heroImages[currentImageIndex]}
          alt={`Mueble MDZ ${currentImageIndex + 1}`}
        />
        <div className="mdz-container">
          <p className="mdz-eyebrow">Hecho a mano en Mendoza</p>
          <h1>MDZ Muebles.<br />Tu espacio,<br /><span>con tu esencia.</span></h1>
          <p className="mdz-hero-description">
            Muebles a medida que unen diseño, madera y oficio. Pensados para tu casa. Hechos para vivirlos.
          </p>
          <a href="#coleccion" className="mdz-btn mdz-btn-brand mdz-btn-lg">
            Descubrí nuestros muebles <i className="fas fa-arrow-up-right-from-square"></i>
          </a>
        </div>
        <div className="mdz-hero-bottom">
          <div className="mdz-container">
            <a className="mdz-hero-label" href="#coleccion">
              <i className="fas fa-chevron-down"></i> Diseño que se siente como hogar
            </a>
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
          {categorias.length > 0 && (
            <div className="mdz-filters" aria-label="Categorías de muebles">
              <button
                className={`mdz-btn mdz-btn-filter mdz-btn-sm ${categoriaActiva === 'Todos' ? 'is-active' : ''}`}
                onClick={() => setCategoriaActiva('Todos')}
              >
                Todos
              </button>
              {categorias.map((c) => (
                <button
                  key={c}
                  className={`mdz-btn mdz-btn-filter mdz-btn-sm ${categoriaActiva === c ? 'is-active' : ''}`}
                  onClick={() => setCategoriaActiva(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mdz-product-grid">
          {productosVisibles.map((mueble) => {
            const src = getPortadaSrc(mueble);
            return (
              <Link className="mdz-product" key={mueble.id} to={`/ViewMueble/${mueble.nombreMueble}`}>
                <div className="mdz-product-image">
                  {src ? (
                    <img src={src} alt={mueble.nombreMueble} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--mdz-muted-foreground)' }}>
                      <i className="fas fa-image" style={{ fontSize: 28 }}></i>
                    </div>
                  )}
                  <span className="mdz-badge"><i className="fas fa-star"></i>A MEDIDA</span>
                </div>
                <div className="mdz-product-meta">
                  <div>
                    <h3>{mueble.nombreMueble}</h3>
                    <p>{mueble.colorMueble}{mueble.categoria ? ` · ${mueble.categoria.nombreCategoria}` : ''}</p>
                  </div>
                  <span className="mdz-product-arrow"><i className="fas fa-arrow-up-right-from-square"></i></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="mdz-container mdz-section mdz-about">
        <img className="mdz-about-image" src={fotoAbout} alt="Taller MDZ Muebles" loading="lazy" />
        <div>
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
              <div key={step.title}>
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

        <form className="mdz-contact-form" onSubmit={handleSubmit}>
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
    </>
  );
};

export default HomePage;
