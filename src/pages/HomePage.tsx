import { useEffect, useState } from "react";
import cocinaNegra from '../assets/images/cocinaNegra.jpg';
import placar from '../assets/images/placar.jpg';
import racks from '../assets/images/racks.jpg';
import fotoAbout from '../assets/images/FotoAbout.jpg';
import cocinaUno from '../assets/images/cocinaUno.jpeg';
import cama1 from '../assets/images/cama1.jpg';
import { useLocation } from "react-router-dom";
import { SolicitarVisitaService } from "../services/SolicitarVisitaService";
import { Cliente } from "../types/Cliente";
import '../pages/Home.css';

const HomePage = () => {
  const location = useLocation();
  const [timestamp, setTimestamp] = useState(Date.now());
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    consulta: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Array de imágenes para el carrusel
  const heroImages = [
    cocinaNegra,
    placar,
    racks
  ];

  // Efectos para scroll y refresco de imágenes
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Efecto para cambiar las imágenes cada 5 segundos
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(imageInterval);
  }, [heroImages.length]);

  // Funciones del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowErrorMessage(false);

    try {
      // Separar nombre y apellido
      const nombreParts = formData.nombreCompleto.trim().split(' ');
      const nombre = nombreParts[0] || '';
      const apellido = nombreParts.slice(1).join(' ') || '';

      // Crear objeto cliente
      const cliente: Cliente = {
        id: 0,
        nombreCliente: nombre,
        apellidoCliente: apellido,
        mailCliente: formData.email,
        telefonoCliente: formData.telefono ? parseInt(formData.telefono) : 0,
        fechaHoraAltaCliente: null,
        fechaHoraModificacionCliente: null,
        estadoCliente: "PENDIENTE",
        fechaHoraBajaCliente: null
      };

      // Crear consulta completa
      const consultaTexto = formData.consulta;

      // Crear objeto para enviar
      const crearConsultaDTO = {
        cliente: cliente,
        consultaSolicitarVisita: consultaTexto
      };

      // Enviar consulta
      await SolicitarVisitaService.crearConsulta(crearConsultaDTO);

      // Mostrar mensaje de éxito
      setShowSuccessMessage(true);
      
      // Limpiar formulario
      setFormData({
        nombreCompleto: '',
        email: '',
        telefono: '',
        consulta: ''
      });

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

    } catch (error) {
      console.error('Error al enviar consulta:', error);
      setShowErrorMessage(true);
      
      // Ocultar mensaje de error después de 5 segundos
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section profesional */}
      <header className={`hero-section ${isScrolled ? 'scrolled' : ''}`}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <i className="fas fa-award"></i>
              <span>10 años de experiencia</span>
            </div>
            <h1 className="hero-title">MDZ MUEBLES</h1>
            <h2 className="hero-subtitle">Carpintería de alta calidad</h2>
            <p className="hero-description">
              Creamos muebles excepcionales con diseño personalizado y acabados impecables. 
              Cada pieza es única y está fabricada con los más altos estándares de calidad.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Proyectos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Satisfacción</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2 años</span>
                <span className="stat-label">Garantía</span>
              </div>
            </div>
            <div className="hero-actions">
              <a href="/catalogo" className="btn btn-primary">
                Explorar catálogo
              </a>
              <a href="#contacto" className="btn btn-secondary">
                Contáctanos
              </a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image-container">
              <img 
                src={heroImages[currentImageIndex]} 
                alt={`Mueble MDZ ${currentImageIndex + 1}`} 
                className="hero-image" 
                key={currentImageIndex}
              />
              <div className="hero-floating-card">
                <div className="card-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="card-content">
                  <h4>Diseño personalizado</h4>
                  <p>A medida de tus espacios</p>
                </div>
              </div>
              {/* Indicadores del carrusel */}
              <div className="carousel-indicators">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sección de Servicios destacados */}
      <section className="services-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="row align-items-center">
            <h6 className="section-subtitle">NUESTRA EXPERIENCIA</h6>
            <h2 className="section-title-new">Lo que ofrecemos</h2>
            <div className="divider-center"></div>
          </div>
          
          <div className="services-grid">
            <div className="service-card animate__animated animate__fadeInUp">
              <div className="service-icon">
                <i className="fas fa-ruler-combined"></i>
              </div>
              <h3>Diseño Personalizado</h3>
              <p>Muebles hechos exactamente a tus medidas y estilo</p>
            </div>
            
            <div className="service-card animate__animated animate__fadeInUp animate__delay-1s">
              <div className="service-icon">
                <i className="fas fa-tree"></i>
              </div>
              <h3>Materiales Premium</h3>
              <p>Maderas de primera calidad y terminaciones impecables</p>
            </div>
            
            <div className="service-card animate__animated animate__fadeInUp animate__delay-2s">
              <div className="service-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Entrega y Montaje</h3>
              <p>Instalación profesional en todo Mendoza</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección "Nuestra Empresa" completamente rediseñada */}
      <section className="about-section-new">
        <div className="container">
          {/* Header de la sección */}
          <div className="about-header">
            <div className="about-badge">
              <i className="fas fa-gem"></i>
              <span>Desde 2020</span>
            </div>
            <h6 className="section-subtitle">NUESTRA EMPRESA</h6>
            <h2 className="section-title-new">Creamos <span className="highlight">sueños</span> en madera</h2>
            <div className="divider-center"></div>
          </div>

          {/* Contenido principal */}
          <div className="about-main-content">
            <div className="about-story">
              <div className="story-text">
                <h3>La pasión por la madera nos define</h3>
                <p className="lead-text">
                  En <strong>MDZ Muebles</strong> no solo fabricamos muebles, creamos experiencias. 
                  Cada pieza cuenta una historia única, diseñada específicamente para ti y tu hogar.
                </p>
                <p>
                  Nuestro compromiso va más allá de la simple carpintería. Somos artesanos del diseño, 
                  especialistas en convertir espacios ordinarios en lugares extraordinarios donde cada 
                  detalle refleja tu personalidad y estilo de vida.
                </p>
              </div>
              
              <div className="story-image">
                <img 
                  src={fotoAbout} 
                  alt="Taller MDZ Muebles"
                  className="story-img"
                />
                <a href="/quienesSomos" className="story-overlay">
                  <div className="overlay-content" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                  }}>
                    <i className="fas fa-play-circle" style={{ fontSize: '2rem', verticalAlign: 'middle' }}></i>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem', verticalAlign: 'middle' }}>Ver más sobre nosotros</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Estadísticas destacadas */}
            <div className="about-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="stat-content">
                  <h4>10+</h4>
                  <p>Años de experiencia</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-content">
                  <h4>500+</h4>
                  <p>Clientes satisfechos</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-hammer"></i>
                </div>
                <div className="stat-content">
                  <h4>1000+</h4>
                  <p>Muebles creados</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="stat-content">
                  <h4>2 años</h4>
                  <p>Garantía total</p>
                </div>
              </div>
            </div>

            {/* Proceso de trabajo */}
            <div className="work-process">
              <h3>Nuestro proceso creativo</h3>
              <div className="process-steps">
                <div className="process-step">
                  <div className="step-number">01</div>
                  <div className="step-content">
                    <h4>Consulta inicial</h4>
                    <p>Analizamos tus necesidades y espacios para entender tu visión perfectamente.</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-number">02</div>
                  <div className="step-content">
                    <h4>Fabricación</h4>
                    <p>Utilizamos técnicas tradicionales y tecnología moderna para crear tu mueble.</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-number">03</div>
                  <div className="step-content">
                    <h4>Entrega perfecta</h4>
                    <p>Instalamos y ajustamos cada detalle hasta que quede exactamente como lo soñaste.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Galería de trabajos */}
           
            <div className="about-gallery-new">
               <div className="section-header">
            <h6 className="section-subtitle">NUESTROS TRABAJOS</h6>
            <h2 className="section-title-center">Algunos de nuestros trabajos</h2>
            <div className="divider-center"></div>
            <p className="section-description" style={{ color: '#FFD600' }}>
              Cada proyecto es único y refleja la personalidad de nuestros clientes
            </p>
          </div>
              <div className="gallery-grid-new">
                <div className="gallery-item-new gallery-large">
                  <img 
                    src={placar} 
                    alt="Placard a medida"
                  />
                  <div className="gallery-overlay-new">
                    <h4>Placard a medida</h4>
                    <p>Diseño moderno y funcional</p>
                  </div>
                </div>
                <div className="gallery-item-new">
                  <img 
                    src={racks} 
                    alt="Mueble de TV"
                  />
                  <div className="gallery-overlay-new">
                    <h4>Mueble de TV</h4>
                    <p>Elegante y práctico</p>
                  </div>
                </div>
                <div className="gallery-item-new">
                  <img 
                    src={cocinaUno} 
                    alt="Cocina integral"
                  />
                  <div className="gallery-overlay-new">
                    <h4>Cocina integral</h4>
                    <p>Funcionalidad premium</p>
                  </div>
                </div>
                <div className="gallery-item-new">
                  <img 
                    src={cama1} 
                    alt="Dormitorio completo"
                  />
                  <div className="gallery-overlay-new">
                    <h4>Dormitorio</h4>
                    <p>Confort y estilo</p>
                  </div>
                </div>
              </div>
            </div>            
          </div>
        </div>
      </section>

      {/* Catálogo con efecto hover mejorado */}
      <section className="catalog-section">
        <div className="container">
          <div className="section-header">
            <h6 className="section-subtitle">NUESTROS PRODUCTOS</h6>
            <h2 className="section-title-center">Explora Nuestro Catálogo</h2>
            <div className="divider-center"></div>
            <p className="section-description" style={{ color: '#FFD600' }}>
              Descubre nuestra amplia gama de muebles diseñados para cada espacio de tu hogar
            </p>
          </div>
          
          <div className="catalog-grid">
            {[
              {
                title: "Camas",
                image: "https://www.dxxi.com.ar/wp-content/uploads/2017/05/dxxi-loft-cama-web-01.jpg",
                count: "+100 Modelos"
              },
              {
                title: "Muebles para TV",
                image: "https://www.dxxi.com.ar/wp-content/uploads/2016/09/Mueble-TV-Tetris-Web-02.jpg",
                count: "+80 Diseños"
              },
              {
                title: "Muebles Infantiles",
                image: "https://www.dxxi.com.ar/wp-content/uploads/2021/06/dxxi-cuna-funcional-rearte-web-01.jpg",
                count: "+50 Opciones"
              },
              {
                title: "Mesas de Luz",
                image: "https://www.dxxi.com.ar/wp-content/uploads/2016/09/Mesa-de-luz-Vintage-Web-01.jpg",
                count: "+70 Modelos"
              },
              {
                title: "Placares",
                image: "https://www.dxxi.com.ar/wp-content/uploads/2020/07/dxxi-ropero-nina-web-03.jpg",
                count: "A medida"
              },
              {
                title: "Escritorios",
                image: "https://www.dxxi.com.ar/wp-content/uploads/2020/02/dxxi-escritorio-Tesla-web-01.jpg",
                count: "+60 Diseños"
              }
            ].map((item, index) => (
              <div 
                className="catalog-card" 
                key={index}
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="card-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.count}</p>
                  <a href="/catalogo" className="btn btn-outline">
                    Ver colección
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <a href="/catalogo" className="btn btn-primary btn-lg">
              Ver catálogo completo <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
          <hr/>
          <hr/>
        </div>
        
            
      </section>
      

      {/* Sección de contacto mejorada */}
      <section className="contact-section" id="contacto">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h6 className="section-subtitle">CONTÁCTANOS</h6>
              <h2 className="section-title">¿Listo para transformar tus espacios?</h2>
              <div className="divider-left"></div>
              <p className="contact-description">
                Completa el formulario y nos pondremos en contacto contigo a la brevedad para discutir tu proyecto y brindarte una cotización personalizada.
              </p>
              
              <div className="contact-details">
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h5>Ubicación</h5>
                    <p>Mendoza, Argentina</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-phone-alt"></i>
                  <div>
                    <h5>Teléfono</h5>
                    <p>+54 261 123 4567</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h5>Email</h5>
                    <p>info@mdzmuebles.com</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <h5>Horario</h5>
                    <p>Lunes a Viernes: 9am - 7pm</p>
                    <p>Sábados: 9am - 1pm</p>
                  </div>
                </div>
              </div>
              
              <div className="social-links">
                <a href="https://www.facebook.com/Esteban.Chaparro028" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/mdz.muebles/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://wa.me/542613663197" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>
            
            <div className="contact-form">
              {/* Mensaje de éxito */}
              {showSuccessMessage && (
                <div className="alert alert-success mb-3">
                  <i className="fas fa-check-circle me-2"></i>
                  ¡Consulta enviada exitosamente! Nos pondremos en contacto contigo pronto.
                </div>
              )}
              
              {/* Mensaje de error */}
              {showErrorMessage && (
                <div className="alert alert-danger mb-3">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  Hubo un error al enviar tu consulta. Por favor, intenta nuevamente.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="nombreCompleto"
                    className="form-control" 
                    placeholder="Nombre completo" 
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email"
                    className="form-control" 
                    placeholder="Correo electrónico" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="tel" 
                    name="telefono"
                    className="form-control" 
                    placeholder="Teléfono (opcional)" 
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    name="consulta"
                    className="form-control" 
                    placeholder="Cuéntanos sobre tu proyecto..." 
                    rows={5}
                    value={formData.consulta}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar consulta <i className="fas fa-paper-plane ml-2"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de contacto final */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h3>¿Tienes alguna pregunta?</h3>
            <p>No dudes en ponerte en contacto con nosotros. Estamos aquí para ayudarte a crear el mueble de tus sueños.</p>
            <div className="newsletter-form" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: '30px'
            }}>
              <a href="#contacto" className="btn btn-secondary" style={{
                background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
                color: 'white',
                border: 'none',
                padding: '18px 50px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 25px rgba(139, 69, 19, 0.3)',
                transform: 'translateY(0)',
                position: 'relative',
                zIndex: 1
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.transform = 'translateY(-3px)';
                target.style.boxShadow = '0 12px 35px rgba(139, 69, 19, 0.4)';
                target.style.background = 'linear-gradient(135deg, #A0522D 0%, #8B4513 100%)';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 8px 25px rgba(139, 69, 19, 0.3)';
                target.style.background = 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)';
              }}>
                <i className="fas fa-phone"></i>
                Contáctanos ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;