

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './QuienesSomos.css';

const QuienesSomos = () => {
  const location = useLocation();
  const [, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, [location]);

  return (
    <div className="catalog-main-container">
      {/* Hero Section */}
        <div className="catalog-header fade-in-up">
              <h1 className="catalog-title">
                <i className="fas fa-users me-3"></i>
                Quiénes Somos
              </h1>
               
              <p className="catalog-subtitle">
               5 años creando muebles únicos en Mendoza
            </p>
            <hr/>
            <div className="about-hero-divider"></div>
         </div>          
            
           

  

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
                <div className="about-timeline-year">2020</div>
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
                <div className="about-timeline-year">2023</div>
                <h3 className="about-timeline-title">Crecimiento</h3>
                <p className="about-timeline-description">
                  Lo que comenzó como un sueño, se ha convertido en 
                  una empresa especializada en la fabricación de muebles personalizados.
                </p>
              </div>
              <div className="about-timeline-visual">
                <div className="about-visual-card">
                  <i className="fas fa-chart-line"></i>
                  <span>Hoy</span>
                </div>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-marker">
                <div className="about-timeline-dot"></div>
              </div>
              <div className="about-timeline-content">
                <div className="about-timeline-year">2025</div>
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
                    MDZ Muebles nació en 2020 con una visión clara: crear muebles de alta calidad 
                    que combinen funcionalidad, diseño y durabilidad para transformar los espacios 
                    de nuestros clientes.
                  </p>
                  <p>
                    Lo que comenzó como un pequeño sueño, se ha convertido en 
                    una empresa dedicada a la fabricación de muebles personalizados. Nuestro compromiso 
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
                <li>Diseño personalizado</li>
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

          {/* Mapa grande y prominente */}
          <div className="about-map-large-container about-fade-in">
            <div className="about-map-wrapper-large">
              <iframe
                src="https://maps.google.com/maps?q=-32.907694,-68.827500&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="700"
                style={{ 
                  border: 0, 
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  filter: 'contrast(1.1) saturate(1.1)'
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación MDZ Muebles - Dorrego, Mendoza, Argentina"
              ></iframe>
            </div>
          </div>

          {/* Información de contacto en cards separadas */}
          <div className="about-contact-cards-grid">
            <div className="about-contact-card about-fade-in-up">
              <div className="about-contact-card-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="about-contact-card-content">
                <h4>Nuestra Ubicación</h4>
                <p>Dorrego, Mendoza<br />Argentina<br />CP: 5500</p>
                <a href="https://maps.app.goo.gl/dPh9qndhp3Nus4fdA" target="_blank" rel="noopener noreferrer" className="about-contact-link">
                  <i className="fas fa-external-link-alt"></i>
                  Ver en Google Maps
                </a>
              </div>
            </div>

            <div className="about-contact-card about-fade-in-up">
              <div className="about-contact-card-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="about-contact-card-content">
                <h4>Teléfonos</h4>
                <p>+54 261 123 4567<br />+54 261 765 4321</p>
                <a href="tel:+542611234567" className="about-contact-link">
                  <i className="fas fa-phone"></i>
                  Llamar ahora
                </a>
              </div>
            </div>

            <div className="about-contact-card about-fade-in-up">
              <div className="about-contact-card-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="about-contact-card-content">
                <h4>Correo Electrónico</h4>
                <p>info@mdzmuebles.com<br />ventas@mdzmuebles.com</p>
                <a href="mailto:info@mdzmuebles.com" className="about-contact-link">
                  <i className="fas fa-envelope"></i>
                  Enviar email
                </a>
              </div>
            </div>
          </div>

          {/* Redes sociales destacadas */}
          <div className="about-social-section">
            <h3>Síguenos en nuestras redes sociales</h3>
            <div className="about-social-links-large">
              <a href="https://www.facebook.com/Esteban.Chaparro028" target="_blank" rel="noopener noreferrer" className="about-social-link-large facebook">
                <i className="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </a>
              <a href="https://www.instagram.com/mdz.muebles/" target="_blank" rel="noopener noreferrer" className="about-social-link-large instagram">
                <i className="fab fa-instagram"></i>
                <span>Instagram</span>
              </a>
              <a href="https://wa.me/542613663197" target="_blank" rel="noopener noreferrer" className="about-social-link-large whatsapp">
                <i className="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
              </a>
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
