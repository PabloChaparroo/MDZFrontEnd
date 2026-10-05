import { Link, useLocation } from "react-router-dom";
import { MuebleImagenes } from "../../types/MuebleImagenes";
import { useEffect, useRef, useState } from "react";
import { CategoriaService } from "../../services/CategoriaService";
import { Categoria } from "../../types/Categoria";
import { Cliente } from "../../types/Cliente";
import { ConsultaService } from "../../services/ConsultaService";
import { MuebleService } from "../../services/MuebleService";
import Loader from "../Loader/Loader";
import '../../styles/mdz-theme.css';
import '../../styles/mdz-site.css';

const ViewMueble = () => {
  const location = useLocation();
  const mueble = location.state.mueble;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategoria = async () => {
      const categorias = await CategoriaService.getAllCategoria();
      setCategorias(categorias);
    };
    fetchCategoria();
  }, []);

  const [imagenesFromBackend, setImagenesFromBackend] = useState<MuebleImagenes[]>([]);
  const [imagenPrincipal, setImagenPrincipal] = useState<MuebleImagenes | null>(null);
  const [loadingImages, setLoadingImages] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<MuebleImagenes | null>(null);

  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        setLoadingImages(true);
        const imagenes = await MuebleService.obtenerImagenesMueble(mueble.id);
        setImagenesFromBackend(imagenes);
        const imagenPortada = imagenes.find((img: MuebleImagenes) => img.esPortada) || imagenes[0];
        setImagenPrincipal(imagenPortada);
      } catch (error) {
        console.error('Error al obtener las imágenes del mueble:', error);
        if (mueble.imagenes && mueble.imagenes.length > 0) {
          setImagenesFromBackend(mueble.imagenes);
          setImagenPrincipal(mueble.imagenes.find((imagen: any) => imagen.esPortada) || mueble.imagenes[0]);
        }
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImagenes();
  }, [mueble.id]);

  const handleClickImagen = (imagen: MuebleImagenes) => {
    setImagenPrincipal(imagen);
  };

  const handleFullscreenImage = (imagen: MuebleImagenes) => {
    setFullscreenImage(imagen);
    setShowFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setShowFullscreen(false);
    setFullscreenImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showFullscreen) {
        handleCloseFullscreen();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFullscreen]);

  const [mailCliente, setMailCliente] = useState('');
  const [mailValido, setMailValido] = useState(true);

  const handleChangeMail = (e: { target: { value: any; }; }) => {
    const correo = e.target.value;
    setMailCliente(correo);
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setMailValido(expresionRegular.test(correo));
  };

  const [nombreCliente, setNombreCliente] = useState('');
  const [apellidoCliente, setApellidoCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState(0);
  const [consultaPresupuesto, setConsultaPresupuesto] = useState('');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSuccessMessage && modalRef.current) {
      window.scrollTo({ top: modalRef.current.offsetTop, behavior: 'smooth' });
    }
  }, [showSuccessMessage]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    crearClienteYVisita(nombreCliente, apellidoCliente, mailCliente, telefonoCliente, consultaPresupuesto);
  };

  const crearClienteYVisita = async (nombreCliente: string, apellidoCliente: string, mailCliente: string, telefonoCliente: number, consultaPresupuesto: string) => {
    const newCliente: Cliente = {
      id: 0,
      nombreCliente,
      apellidoCliente,
      mailCliente,
      telefonoCliente,
      fechaHoraAltaCliente: null,
      fechaHoraModificacionCliente: null,
      fechaHoraBajaCliente: null,
    };

    await ConsultaService.crearConsulta({
      cliente: newCliente,
      muebleId: mueble.id,
      mensajeConsulta: consultaPresupuesto,
    });

    setShowSuccessMessage(true);
    if (modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {showFullscreen && fullscreenImage && (
        <div className="mdz-fullscreen-overlay" onClick={handleCloseFullscreen}>
          <button className="mdz-fullscreen-close" onClick={handleCloseFullscreen} aria-label="Cerrar">
            <i className="fas fa-times"></i>
          </button>
          <img
            src={`data:image/png;base64, ${fullscreenImage.imagenes}`}
            alt={mueble.nombreMueble}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="mdz-container mdz-section">
        <Link to="/catalogo" className="mdz-back-link">
          <i className="fas fa-arrow-left"></i> Volver al catálogo
        </Link>

        <div className="mdz-detail-grid">
          {/* Columna principal */}
          <div>
            {/* Galería */}
            <div className="mdz-gallery-main">
              {loadingImages ? (
                <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}><Loader /></div>
              ) : imagenPrincipal ? (
                <img
                  key={imagenPrincipal.id}
                  src={`data:image/png;base64, ${imagenPrincipal.imagenes}`}
                  alt={mueble.nombreMueble}
                  onClick={() => handleFullscreenImage(imagenPrincipal)}
                />
              ) : (
                <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--mdz-muted-foreground)' }}>
                  <i className="fas fa-image" style={{ fontSize: 32 }}></i>
                </div>
              )}
            </div>

            {imagenesFromBackend.length > 1 && (
              <div className="mdz-gallery-thumbs">
                {imagenesFromBackend.map((imagen: MuebleImagenes) => (
                  <button
                    key={imagen.id}
                    type="button"
                    className={`mdz-gallery-thumb ${imagenPrincipal?.id === imagen.id ? 'is-active' : ''}`}
                    onClick={() => handleClickImagen(imagen)}
                  >
                    <img src={`data:image/png;base64, ${imagen.imagenes}`} alt={mueble.nombreMueble} />
                  </button>
                ))}
              </div>
            )}

            {/* Detalles */}
            <div style={{ marginTop: 40 }}>
              <h1 className="mdz-detail-title">{mueble.nombreMueble}</h1>
              <p className="mdz-detail-desc">{mueble.descripcion}</p>

              <div className="mdz-spec-row">
                <div className="mdz-card-icon"><i className="fas fa-palette"></i></div>
                <div>
                  <h4>Color</h4>
                  <p>{mueble.colorMueble}</p>
                </div>
              </div>
              <p className="mdz-detail-note">
                Este es un mueble a medida: las dimensiones, terminaciones y precio se definen a partir de tu consulta.
              </p>
            </div>

            {/* Formulario de consulta */}
            <div style={{ marginTop: 48 }}>
              <h2 style={{ fontFamily: 'var(--mdz-font-display)', fontWeight: 500, fontSize: 24, marginBottom: 6 }}>
                Consultar por este mueble
              </h2>
              <p className="mdz-section-copy" style={{ marginBottom: 24 }}>
                Completá el formulario y nos pondremos en contacto con vos.
              </p>

              <form onSubmit={handleSubmit} className="mdz-contact-form">
                <label>
                  Nombre
                  <input type="text" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} required />
                </label>
                <label>
                  Apellido
                  <input type="text" value={apellidoCliente} onChange={(e) => setApellidoCliente(e.target.value)} required />
                </label>
                <label>
                  Email
                  <input type="email" value={mailCliente} onChange={handleChangeMail} required />
                  {!mailValido && <span className="mdz-form-feedback is-error">El correo electrónico no es válido</span>}
                </label>
                <label>
                  Teléfono (opcional)
                  <input type="tel" value={telefonoCliente || ''} onChange={(e) => setTelefonoCliente(e.target.valueAsNumber || 0)} />
                </label>
                <label className="mdz-full-field">
                  Consulta
                  <textarea
                    rows={4}
                    value={consultaPresupuesto}
                    onChange={(e) => setConsultaPresupuesto(e.target.value)}
                    placeholder="Describí tu consulta: presupuesto específico, cambios de diseño, otras medidas, etc."
                  />
                </label>
                <button type="submit" className="mdz-btn mdz-btn-brand mdz-btn-lg mdz-full-field" style={{ justifyContent: 'space-between' }}>
                  Enviar consulta <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="mdz-sidebar">
            <div className="mdz-sidebar-card">
              <h3>{mueble.nombreMueble}</h3>
              <div className="mdz-rating">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                <i className="fas fa-star"></i><i className="fas fa-star"></i>
                <span>(Trabajo artesanal)</span>
              </div>

              <div className="mdz-feature-list">
                <div className="mdz-feature-item"><i className="fas fa-hammer"></i> Hecho a mano</div>
                <div className="mdz-feature-item"><i className="fas fa-leaf"></i> Materiales naturales</div>
                <div className="mdz-feature-item"><i className="fas fa-truck"></i> Entrega a domicilio</div>
                <div className="mdz-feature-item"><i className="fas fa-tools"></i> Instalación incluida</div>
              </div>

              <h4>Síguenos en redes sociales</h4>
              <div className="mdz-social-row">
                <a href="https://www.facebook.com/Esteban.Chaparro028" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/mdz.muebles/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://wa.me/542613663197" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>

            <div className="mdz-sidebar-card">
              <h4>Categorías</h4>
              <div className="mdz-category-list">
                {categorias.map((categoria) => (
                  <Link key={categoria.id} to="/catalogo" state={{ categoria: categoria.nombreCategoria }}>
                    {categoria.nombreCategoria} <i className="fas fa-angle-right"></i>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mdz-sidebar-card">
              <h4>¿Cómo trabajamos?</h4>
              <div className="mdz-process-list">
                <div className="step">
                  <div className="step-number">1</div>
                  <div><h5>Consulta</h5><p>Completás el formulario con tus requerimientos.</p></div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div><h5>Visita</h5><p>Visitamos tu hogar para tomar medidas exactas.</p></div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div><h5>Presupuesto</h5><p>Te enviamos un presupuesto detallado.</p></div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div><h5>Creación</h5><p>Fabricamos tu mueble con materiales de calidad.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="mdz-confirm-overlay" onClick={() => setShowSuccessMessage(false)}>
          <div className="mdz-modal-content mdz-confirm-card" ref={modalRef} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, textAlign: 'center' }}>
            <i className="fas fa-check-circle" style={{ fontSize: 40, color: 'var(--mdz-primary)', marginBottom: 14 }}></i>
            <h3 style={{ justifyContent: 'center' }}>¡Consulta enviada correctamente!</h3>
            <p>
              Gracias <strong>{nombreCliente} {apellidoCliente}</strong> por contactarte con nosotros.
              En breve nos comunicaremos para responder tu consulta.
            </p>
            <div className="mdz-confirm-actions" style={{ justifyContent: 'center' }}>
              <button className="mdz-btn mdz-btn-brand" onClick={() => setShowSuccessMessage(false)}>Entendido</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewMueble;
