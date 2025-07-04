

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './QuienesSomos.css';

const QuienesSomos = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, [location]);

  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-container">
          <div className={`about-hero-content ${isVisible ? 'about-fade-in' : ''}`}>
            <div className="about-hero-title-wrapper">
              <h1 className="about-hero-title about-title-yellow">
                <i className="fas fa-users me-3"></i>
                Quiénes Somos
              </h1>
            </div>
            <p className="about-hero-subtitle">
              15 años creando muebles únicos en Mendoza
            </p>
            <div className="about-hero-divider"></div>
          </div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="about-story-section">
        <div className="about-container">
          <div className="about-section-header-center about-fade-in">
            <i className="fas fa-history about-icon"></i>
            <h2>Nuestra Historia</h2>
            <p>15 años creando muebles únicos en Mendoza</p>
          </div>

          {/* Timeline moderna */}
          <div className="about-timeline about-fade-in-up">
            <div className="about-timeline-item">
              <div className="about-timeline-marker">
                <div className="about-timeline-dot"></div>
              </div>
              <div className="about-timeline-content">
                <div className="about-timeline-year">2009</div>
                <h3 className="about-timeline-title">Los Comienzos</h3>
                <p className="about-timeline-description">
                  MDZ Muebles nació con una visión clara: crear muebles de alta calidad 
                  que combinen funcionalidad, diseño y durabilidad para transformar los espacios 
                  de nuestros clientes.
                </p>
              </div>
              <div className="about-timeline-visual">
                <div className="about-visual-card">
                  <i className="fas fa-hammer"></i>
                  <span>Primer Taller</span>
                </div>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-marker">
                <div className="about-timeline-dot"></div>
              </div>
              <div className="about-timeline-content">
                <div className="about-timeline-year">2015</div>
                <h3 className="about-timeline-title">Crecimiento y Expansión</h3>
                <p className="about-timeline-description">
                  Lo que comenzó como un pequeño taller familiar en Mendoza, se ha convertido en 
                  una empresa líder en la fabricación de muebles personalizados.
                </p>
              </div>
              <div className="about-timeline-visual">
                <div className="about-visual-card">
                  <i className="fas fa-chart-line"></i>
                  <span>Expansión</span>
                </div>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-marker">
                <div className="about-timeline-dot"></div>
              </div>
              <div className="about-timeline-content">
                <div className="about-timeline-year">2024</div>
                <h3 className="about-timeline-title">Líderes en el Mercado</h3>
                <p className="about-timeline-description">
                  Nuestro compromiso con la excelencia y la satisfacción del cliente nos ha permitido 
                  crecer y ganarnos la confianza de más de 500 familias y empresas.
                </p>
              </div>
              <div className="about-timeline-visual">
                <div className="about-visual-card">
                  <i className="fas fa-trophy"></i>
                  <span>Liderazgo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-story-content-wrapper">
            <div className="about-row about-align-items-center">
              <div className="about-col-lg-6">
                <div className="about-story-content about-fade-in-left">
                  <p className="about-lead">
                    MDZ Muebles nació en 2009 con una visión clara: crear muebles de alta calidad 
                    que combinen funcionalidad, diseño y durabilidad para transformar los espacios 
                    de nuestros clientes.
                  </p>
                  <p>
                    Lo que comenzó como un pequeño taller familiar en Mendoza, se ha convertido en 
                    una empresa líder en la fabricación de muebles personalizados. Nuestro compromiso 
                    con la excelencia y la satisfacción del cliente nos ha permitido crecer y ganarnos 
                    la confianza de más de 500 familias y empresas.
                  </p>
                </div>
              </div>
              <div className="about-col-lg-6">
                <div className="about-story-stats about-fade-in-right">
                  <div className="about-stat-item">
                    <span className="about-stat-number">15+</span>
                    <span className="about-stat-label">Años de experiencia</span>
                  </div>
                  <div className="about-stat-item">
                    <span className="about-stat-number">500+</span>
                    <span className="about-stat-label">Proyectos completados</span>
                  </div>
                  <div className="about-stat-item">
                    <span className="about-stat-number">100%</span>
                    <span className="about-stat-label">Satisfacción garantizada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A qué nos dedicamos */}
      <section className="about-services-section">
        <div className="about-container">
          <div className="about-section-header-center about-fade-in">
            <i className="fas fa-tools about-icon"></i>
            <h2>A Qué Nos Dedicamos</h2>
            <p>Especializados en la creación de muebles únicos y personalizados</p>
          </div>

          <div className="about-services-grid">
            <div className="about-service-card about-fade-in-up">
              <div className="about-service-icon">
                <i className="fas fa-bed"></i>
              </div>
              <h3>Muebles para Dormitorio</h3>
              <p>Camas, placares, mesas de luz y cómodas diseñadas para crear espacios de descanso únicos y funcionales.</p>
              <ul>
                <li>Camas matrimoniales y individuales</li>
                <li>Placares empotrados y modulares</li>
                <li>Mesas de luz y cómodas</li>
                <li>Vestidores a medida</li>
              </ul>
            </div>

            <div className="about-service-card about-fade-in-up">
              <div className="about-service-icon">
                <i className="fas fa-tv"></i>
              </div>
              <h3>Muebles para Living</h3>
              <p>Racks para TV, bibliotecas y muebles de entretenimiento que combinan estilo y funcionalidad.</p>
              <ul>
                <li>Racks y centros de entretenimiento</li>
                <li>Bibliotecas y estanterías</li>
                <li>Mesas de centro y laterales</li>
                <li>Muebles modulares</li>
              </ul>
            </div>

            <div className="about-service-card about-fade-in-up">
              <div className="about-service-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Muebles de Cocina</h3>
              <p>Alacenas, despenseros y muebles auxiliares para optimizar el espacio de tu cocina.</p>
              <ul>
                <li>Alacenas superiores e inferiores</li>
                <li>Despenseros y auxiliares</li>
                <li>Islas y barras</li>
                <li>Muebles esquineros</li>
              </ul>
            </div>

            <div className="about-service-card about-fade-in-up">
              <div className="about-service-icon">
                <i className="fas fa-laptop"></i>
              </div>
              <h3>Muebles de Oficina</h3>
              <p>Escritorios, bibliotecas y soluciones de almacenamiento para espacios de trabajo productivos.</p>
              <ul>
                <li>Escritorios ejecutivos y compactos</li>
                <li>Bibliotecas y archivadores</li>
                <li>Muebles para computadora</li>
                <li>Estaciones de trabajo</li>
              </ul>
            </div>

            <div className="about-service-card about-fade-in-up">
              <div className="about-service-icon">
                <i className="fas fa-child"></i>
              </div>
              <h3>Muebles Infantiles</h3>
              <p>Cunas, camas y muebles especialmente diseñados para los más pequeños de la casa.</p>
              <ul>
                <li>Cunas funcionales y tradicionales</li>
                <li>Camas infantiles y juveniles</li>
                <li>Escritorios para estudio</li>
                <li>Jugueteros y organizadores</li>
              </ul>
            </div>

            <div className="about-service-card about-fade-in-up">
              <div className="about-service-icon">
                <i className="fas fa-ruler-combined"></i>
              </div>
              <h3>Diseño Personalizado</h3>
              <p>Creamos muebles únicos adaptados a tus espacios, necesidades y estilo personal.</p>
              <ul>
                <li>Diseño 3D personalizado</li>
                <li>Asesoramiento profesional</li>
                <li>Medidas exactas</li>
                <li>Materiales premium</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="about-values-section">
        <div className="about-container">
          <div className="about-section-header-center about-fade-in">
            <i className="fas fa-heart about-icon"></i>
            <h2>Nuestros Valores</h2>
            <p>Los principios que guían nuestro trabajo diario</p>
          </div>

          <div className="about-values-grid">
            <div className="about-value-card about-fade-in-up">
              <div className="about-value-icon">
                <i className="fas fa-gem"></i>
              </div>
              <h3>Calidad Premium</h3>
              <p>Utilizamos solo los mejores materiales y técnicas de fabricación para garantizar muebles duraderos y hermosos.</p>
            </div>

            <div className="about-value-card about-fade-in-up">
              <div className="about-value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Compromiso</h3>
              <p>Nos comprometemos con cada proyecto, desde el diseño inicial hasta la instalación final, asegurando tu satisfacción.</p>
            </div>

            <div className="about-value-card about-fade-in-up">
              <div className="about-value-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Innovación</h3>
              <p>Combinamos técnicas tradicionales con tecnología moderna para crear soluciones innovadoras y funcionales.</p>
            </div>

            <div className="about-value-card about-fade-in-up">
              <div className="about-value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Atención Personalizada</h3>
              <p>Cada cliente es único, por eso ofrecemos un servicio personalizado adaptado a sus necesidades específicas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicación y Contacto */}
      <section className="about-location-section">
        <div className="about-container">
          <div className="about-section-header-center about-fade-in">
            <i className="fas fa-map-marker-alt about-icon"></i>
            <h2>Nuestra Ubicación</h2>
            <p>Visítanos en nuestro taller en Mendoza</p>
          </div>

          <div className="about-row">
            <div className="about-col-lg-8">
              <div className="about-map-container about-fade-in-left">
                <div className="about-map-wrapper">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d428596.70681725315!2d-69.11357821524691!3d-32.89018113314251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e093ec45179bf%3A0x205a78f6d20efa3a!2sMendoza%2C%20Argentina!5e0!3m2!1ses!2sar!4v1672847123456!5m2!1ses!2sar"
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: '12px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación MDZ Muebles"
                  ></iframe>
                </div>
              </div>
            </div>
            
            <div className="about-col-lg-4">
              <div className="about-contact-info-card about-fade-in-right">
                <div className="about-contact-header">
                  <i className="fas fa-store"></i>
                  <h3>Información de Contacto</h3>
                </div>
                
                <div className="about-contact-details">
                  <div className="about-detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <h4>Dirección</h4>
                      <p>Calle Principal 123<br />Mendoza, Argentina<br />CP: 5500</p>
                    </div>
                  </div>
                  
                  <div className="about-detail-item">
                    <i className="fas fa-phone"></i>
                    <div>
                      <h4>Teléfono</h4>
                      <p>+54 261 123 4567</p>
                      <p>+54 261 765 4321</p>
                    </div>
                  </div>
                  
                  <div className="about-detail-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <h4>Email</h4>
                      <p>info@mdzmuebles.com</p>
                      <p>ventas@mdzmuebles.com</p>
                    </div>
                  </div>
                  
                  <div className="about-detail-item">
                    <i className="fas fa-clock"></i>
                    <div>
                      <h4>Horarios de Atención</h4>
                      <p><strong>Lunes a Viernes:</strong><br />9:00 AM - 7:00 PM</p>
                      <p><strong>Sábados:</strong><br />9:00 AM - 1:00 PM</p>
                      <p><strong>Domingos:</strong><br />Cerrado</p>
                    </div>
                  </div>
                </div>
                
                <div className="about-social-links">
                  <a href="#" className="about-social-link">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="about-social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="about-social-link">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                  <a href="#" className="about-social-link">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta-section">
        <div className="about-container">
          <div className="about-cta-content about-fade-in">
            <h2>¿Listo para crear el mueble de tus sueños?</h2>
            <p>Contáctanos hoy mismo y comencemos a trabajar en tu proyecto personalizado</p>
            <div className="about-cta-buttons">
              <a href="/catalogo" className="btn btn-primary">
                <i className="fas fa-eye me-2"></i>
                Ver Catálogo
              </a>
              <a href="tel:+542611234567" className="btn btn-secondary">
                <i className="fas fa-phone me-2"></i>
                Llamar Ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuienesSomos;
