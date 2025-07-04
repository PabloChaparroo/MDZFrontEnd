import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import '../pages/Home.css';

const HomePage = () => {
  const location = useLocation();
  const [timestamp, setTimestamp] = useState(Date.now());
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array de imágenes para el carrusel
  const heroImages = [
    "src/assets/images/cocinaNegra.jpg",
    "src/assets/images/placar.jpg",
    "src/assets/images/racks.jpg"
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

  return (
    <>
      {/* Hero Section profesional */}
      <header className={`hero-section ${isScrolled ? 'scrolled' : ''}`}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <i className="fas fa-award"></i>
              <span>15 años de experiencia</span>
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
            <h2 className="section-title">Lo que ofrecemos</h2>
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

      {/* Sección "Sobre Nosotros" mejorada */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h6 className="section-subtitle">NUESTRA EMPRESA</h6>
              <h2 className="section-title">Artesanía en cada detalle</h2>
              <div className="divider-left"></div>
              <p className="lead">
                En <strong>MDZ Muebles</strong> combinamos tradición e innovación para crear piezas únicas que se adaptan perfectamente a tus espacios y estilo de vida.
              </p>
              <p>
                Cada mueble es diseñado con atención meticulosa a los detalles y fabricado con los más altos estándares de calidad. Nuestro equipo de diseñadores y artesanos trabaja en estrecha colaboración contigo para materializar tus ideas en piezas funcionales y estéticamente impresionantes.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>15 años de experiencia</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>+500 clientes satisfechos</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Garantía de 2 años</span>
                </div>
              </div>
              <a href="/nosotros" className="btn btn-primary">
                Conoce más sobre nosotros <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            <div className="about-gallery">
              <div className="gallery-main">
                <img 
                  src={`src/assets/images/placar.jpg?timestamp=${timestamp}`} 
                  alt="Placar MDZ Muebles" 
                  className="img-main"
                />
              </div>
              <div className="gallery-secondary">
                <img 
                  src={`src/assets/images/racks.jpg?timestamp=${timestamp}`} 
                  alt="Mueble de TV" 
                  className="img-secondary"
                />
                <img 
                  src="src/assets/images/cocinaUno.jpeg" 
                  alt="Cocina" 
                  className="img-secondary"
                />
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
            <h2 className="section-title">Explora Nuestro Catálogo</h2>
            <div className="divider-center"></div>
            <p className="section-description">
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
        </div>
      </section>

      {/* Galería de proyectos destacados */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-header">
            <h6 className="section-subtitle">NUESTRO TRABAJO</h6>
            <h2 className="section-title">Proyectos Destacados</h2>
            <div className="divider-center"></div>
            <p className="section-description">
              Algunos de nuestros trabajos más recientes y destacados
            </p>
          </div>
          
          <div className="gallery-grid">
            {[
              "src/assets/images/proyecto1.jpg",
              "src/assets/images/proyecto2.jpg",
              "src/assets/images/proyecto3.jpg",
              "src/assets/images/proyecto4.jpg",
              "src/assets/images/proyecto5.jpg",
              "src/assets/images/proyecto6.jpg"
            ].map((img, index) => (
              <div className="gallery-item" key={index}>
                <img src={img} alt={`Proyecto MDZ Muebles ${index + 1}`} />
                <div className="gallery-hover">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios de clientes */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h6 className="section-subtitle">OPINIONES</h6>
            <h2 className="section-title">Lo que dicen nuestros clientes</h2>
            <div className="divider-center"></div>
          </div>
          
          <div className="testimonials-slider">
            {[
              {
                name: "María González",
                role: "Cliente residencial",
                text: "Quedé encantada con mi placard a medida. El equipo de MDZ Muebles entendió perfectamente lo que necesitaba y el resultado superó mis expectativas. La calidad de los materiales es excelente.",
                rating: 5
              },
              {
                name: "Carlos Martínez",
                role: "Cliente corporativo",
                text: "Contratamos a MDZ Muebles para amueblar nuestras nuevas oficinas y el trabajo fue impecable. Cumplieron con los plazos y los muebles tienen un diseño moderno y funcional.",
                rating: 5
              },
              {
                name: "Lucía Fernández",
                role: "Cliente residencial",
                text: "El mueble de TV que me hicieron es exactamente como lo soñé. El proceso de diseño fue muy profesional y el resultado final es de una calidad excepcional. ¡Los recomiendo totalmente!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i className="fas fa-star" key={i}></i>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <h5>{testimonial.name}</h5>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
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
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-whatsapp"></i></a>
                <a href="#"><i className="fab fa-pinterest-p"></i></a>
              </div>
            </div>
            
            <div className="contact-form">
              <form>
                <div className="form-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nombre completo" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Correo electrónico" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="Teléfono (opcional)" 
                  />
                </div>
                <div className="form-group">
                  <select className="form-control" required>
                    <option value="">Tipo de consulta</option>
                    <option value="cotizacion">Cotización</option>
                    <option value="diseno">Diseño personalizado</option>
                    <option value="general">Consulta general</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea 
                    className="form-control" 
                    placeholder="Cuéntanos sobre tu proyecto..." 
                    rows={5}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Enviar consulta <i className="fas fa-paper-plane ml-2"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h3>Suscríbete a nuestro newsletter</h3>
            <p>Recibe novedades, promociones y consejos de decoración directamente en tu email.</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                required 
              />
              <button type="submit">
                Suscribirse <i className="fas fa-envelope ml-2"></i>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;