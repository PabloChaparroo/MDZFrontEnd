import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import fotoAbout from '../assets/images/fotoAbout.webp';
import '../styles/mdz-theme.css';
import '../styles/mdz-site.css';

const timeline = [
  { year: '2020', title: 'Los comienzos', text: 'MDZ Muebles nació con una visión clara: crear muebles de alta calidad que combinen funcionalidad, diseño y durabilidad para transformar los espacios de nuestros clientes.' },
  { year: '2023', title: 'Crecimiento', text: 'Lo que comenzó como un sueño, se ha convertido en una empresa especializada en la fabricación de muebles personalizados.' },
  { year: '2025', title: 'Líderes en el mercado', text: 'Nuestro compromiso con la excelencia y la satisfacción del cliente nos ha permitido crecer y ganarnos la confianza de más de 500 familias y empresas.' },
];

const servicios = [
  { icon: 'fa-bed', title: 'Muebles para dormitorio', text: 'Camas, placares, mesas de luz y cómodas diseñadas para crear espacios de descanso únicos y funcionales.', items: ['Camas matrimoniales e individuales', 'Placares empotrados y modulares', 'Mesas de luz y cómodas', 'Vestidores a medida'] },
  { icon: 'fa-tv', title: 'Muebles para living', text: 'Racks para TV, bibliotecas y muebles de entretenimiento que combinan estilo y funcionalidad.', items: ['Racks y centros de entretenimiento', 'Bibliotecas y estanterías', 'Mesas de centro y laterales', 'Muebles modulares'] },
  { icon: 'fa-utensils', title: 'Muebles de cocina', text: 'Alacenas, despenseros y muebles auxiliares para optimizar el espacio de tu cocina.', items: ['Alacenas superiores e inferiores', 'Despenseros y auxiliares', 'Islas y barras', 'Muebles esquineros'] },
  { icon: 'fa-laptop', title: 'Muebles de oficina', text: 'Escritorios, bibliotecas y soluciones de almacenamiento para espacios de trabajo productivos.', items: ['Escritorios ejecutivos y compactos', 'Bibliotecas y archivadores', 'Muebles para computadora', 'Estaciones de trabajo'] },
  { icon: 'fa-child', title: 'Muebles infantiles', text: 'Cunas, camas y muebles especialmente diseñados para los más pequeños de la casa.', items: ['Cunas funcionales y tradicionales', 'Camas infantiles y juveniles', 'Escritorios para estudio', 'Jugueteros y organizadores'] },
  { icon: 'fa-ruler-combined', title: 'Diseño personalizado', text: 'Creamos muebles únicos adaptados a tus espacios, necesidades y estilo personal.', items: ['Diseño personalizado', 'Asesoramiento profesional', 'Medidas exactas', 'Materiales premium'] },
];

const valores = [
  { icon: 'fa-gem', title: 'Calidad premium', text: 'Utilizamos solo los mejores materiales y técnicas de fabricación para garantizar muebles duraderos y hermosos.' },
  { icon: 'fa-handshake', title: 'Compromiso', text: 'Nos comprometemos con cada proyecto, desde el diseño inicial hasta la instalación final, asegurando tu satisfacción.' },
  { icon: 'fa-lightbulb', title: 'Innovación', text: 'Combinamos técnicas tradicionales con tecnología moderna para crear soluciones innovadoras y funcionales.' },
  { icon: 'fa-users', title: 'Atención personalizada', text: 'Cada cliente es único, por eso ofrecemos un servicio personalizado adaptado a sus necesidades específicas.' },
];

const QuienesSomos = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {/* Header de página */}
      <div className="mdz-page-header mdz-diagonal-detail">
        <div className="mdz-container">
          <p className="mdz-eyebrow">El taller</p>
          <h1>Quiénes somos.</h1>
          <p className="mdz-section-copy">6 años creando muebles únicos en Mendoza.</p>
        </div>
      </div>

      {/* Nuestra historia */}
      <section className="mdz-container mdz-section">
        <div className="mdz-section-heading">
          <div>
            <p className="mdz-eyebrow">Nuestra historia</p>
            <h2>6 años creando muebles únicos en Mendoza.</h2>
          </div>
        </div>

        <div className="mdz-timeline" style={{ marginBottom: 56 }}>
          {timeline.map((item) => (
            <div className="mdz-timeline-item" key={item.year}>
              <div className="mdz-timeline-year">{item.year}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mdz-about-text-stats">
          <div>
            <p className="mdz-section-copy" style={{ marginBottom: 14 }}>
              MDZ Muebles nació en 2020 con una visión clara: crear muebles de alta calidad que combinen
              funcionalidad, diseño y durabilidad para transformar los espacios de nuestros clientes.
            </p>
            <p className="mdz-section-copy" style={{ marginBottom: 28 }}>
              Lo que comenzó como un pequeño sueño, se ha convertido en una empresa dedicada a la fabricación
              de muebles personalizados. Nuestro compromiso con la excelencia y la satisfacción del cliente
              nos ha permitido crecer y ganarnos la confianza de más de 500 familias y empresas.
            </p>
            <div className="mdz-stat-row">
              <div className="mdz-stat"><strong>15+</strong><span>Años de experiencia</span></div>
              <div className="mdz-stat"><strong>500+</strong><span>Proyectos completados</span></div>
              <div className="mdz-stat"><strong>100%</strong><span>Satisfacción garantizada</span></div>
            </div>
          </div>
          <img className="mdz-about-image" src={fotoAbout} alt="Taller MDZ Muebles" loading="lazy" />
        </div>
      </section>

      {/* A qué nos dedicamos */}
      <section className="mdz-section mdz-process">
        <div className="mdz-container">
          <div className="mdz-section-heading">
            <div>
              <p className="mdz-eyebrow">A qué nos dedicamos</p>
              <h2>Especializados en muebles únicos y personalizados.</h2>
            </div>
          </div>
          <div className="mdz-card-grid">
            {servicios.map((s) => (
              <div className="mdz-card" key={s.title}>
                <div className="mdz-card-icon"><i className={`fas ${s.icon}`}></i></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul>
                  {s.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestros valores */}
      <section className="mdz-container mdz-section">
        <div className="mdz-section-heading">
          <div>
            <p className="mdz-eyebrow">Nuestros valores</p>
            <h2>Los principios que guían nuestro trabajo diario.</h2>
          </div>
        </div>
        <div className="mdz-value-grid">
          {valores.map((v) => (
            <div className="mdz-card mdz-value-card" key={v.title}>
              <div className="mdz-card-icon"><i className={`fas ${v.icon}`}></i></div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ubicación y contacto */}
      <section className="mdz-section mdz-process">
        <div className="mdz-container">
          <div className="mdz-section-heading">
            <div>
              <p className="mdz-eyebrow">Nuestra ubicación</p>
              <h2>Visitanos en nuestro taller en Mendoza.</h2>
            </div>
          </div>

          <div className="mdz-map">
            <iframe
              src="https://maps.google.com/maps?q=-32.907694,-68.827500&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="420"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación MDZ Muebles - Dorrego, Mendoza, Argentina"
            ></iframe>
          </div>

          <div className="mdz-card-grid" style={{ marginBottom: 48 }}>
            <div className="mdz-card">
              <div className="mdz-contact-card-icon"><i className="fas fa-map-marker-alt"></i></div>
              <h3>Nuestra ubicación</h3>
              <p>Dorrego, Mendoza<br />Argentina · CP 5500</p>
              <a href="https://maps.app.goo.gl/dPh9qndhp3Nus4fdA" target="_blank" rel="noopener noreferrer" className="mdz-btn mdz-btn-filter mdz-btn-sm">
                Ver en Google Maps <i className="fas fa-arrow-up-right-from-square"></i>
              </a>
            </div>
            <div className="mdz-card">
              <div className="mdz-contact-card-icon"><i className="fas fa-phone"></i></div>
              <h3>Teléfonos</h3>
              <p>+54 261 123 4567<br />+54 261 765 4321</p>
              <a href="tel:+542611234567" className="mdz-btn mdz-btn-filter mdz-btn-sm">
                Llamar ahora <i className="fas fa-phone"></i>
              </a>
            </div>
            <div className="mdz-card">
              <div className="mdz-contact-card-icon"><i className="fas fa-envelope"></i></div>
              <h3>Correo electrónico</h3>
              <p>info@mdzmuebles.com<br />ventas@mdzmuebles.com</p>
              <a href="mailto:info@mdzmuebles.com" className="mdz-btn mdz-btn-filter mdz-btn-sm">
                Enviar email <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--mdz-font-display)', fontWeight: 500, marginBottom: 18 }}>
              Síguenos en nuestras redes sociales
            </h3>
            <div className="mdz-social-row">
              <a href="https://www.facebook.com/Esteban.Chaparro028" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
              <a href="https://www.instagram.com/mdz.muebles/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a href="https://wa.me/542613663197" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mdz-section mdz-cta">
        <div className="mdz-container">
          <h2>¿Listo para crear el mueble de tus sueños?</h2>
          <p className="mdz-section-copy">Contactanos hoy mismo y comencemos a trabajar en tu proyecto personalizado.</p>
          <div className="mdz-cta-actions">
            <a href="/catalogo" className="mdz-btn mdz-btn-brand mdz-btn-lg">
              Ver catálogo <i className="fas fa-eye"></i>
            </a>
            <a href="tel:+542611234567" className="mdz-btn mdz-btn-filter mdz-btn-lg">
              Llamar ahora <i className="fas fa-phone"></i>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default QuienesSomos;
