
import { useLocation } from "react-router-dom";
import { MuebleImagenes } from "../../types/MuebleImagenes";
import { useEffect, useRef, useState } from "react";
import { CategoriaService } from "../../services/CategoriaService";
import { Categoria } from "../../types/Categoria";
import "./ViewMueble.css"
import { Cliente } from "../../types/Cliente";
import { SolicitarVisitaService } from "../../services/SolicitarVisitaService";
import { SolicitarVisita } from "../../types/SolicitarVisita";
import { MuebleService } from "../../services/MuebleService";







const ViewMueble = () => {





  const location = useLocation();
  const mueble = location.state.mueble;


  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la ventana hacia arriba al acceder a la página de inicio
  }, [location]); // Ejecuta el efecto cada vez que cambie la ubicación

  

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() =>{
    //Llamamos a la funcion para obtener todos los muebles declarados en el Servicio
    const fetchCategoria= async() => {
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

  // Efecto para cargar las imágenes del mueble desde el backend
  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        setLoadingImages(true);
        const imagenes = await MuebleService.obtenerImagenesMueble(mueble.id);
        setImagenesFromBackend(imagenes);
        // Establecer la imagen principal como la primera imagen de portada o la primera imagen
        const imagenPortada = imagenes.find((img: MuebleImagenes) => img.esPortada) || imagenes[0];
        setImagenPrincipal(imagenPortada);
      } catch (error) {
        console.error('Error al obtener las imágenes del mueble:', error);
        // Fallback: usar las imágenes que vienen con el mueble
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

  // Cerrar fullscreen con tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showFullscreen) {
        handleCloseFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFullscreen]);
  

  // Estados y referencias para el zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const mouseThrottleRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    console.log('Mouse enter - activating zoom');
    setZoomLevel(1.5);
    setIsZooming(true);
  };

  const handleMouseLeave = (event?: React.MouseEvent<HTMLImageElement>) => {
    console.log('Mouse leave - deactivating zoom');
    setZoomLevel(1);
    setIsZooming(false);
    
    if (event?.currentTarget) {
      event.currentTarget.style.setProperty('transform', 'scale(1)', 'important');
      event.currentTarget.style.setProperty('transform-origin', 'center center', 'important');
      event.currentTarget.style.removeProperty('z-index');
    }
    
    if (mouseThrottleRef.current) {
      window.cancelAnimationFrame(mouseThrottleRef.current);
      mouseThrottleRef.current = null;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    console.log('Mouse move detected - isZooming:', isZooming, 'zoomLevel:', zoomLevel);
    
    if (!isZooming || zoomLevel === 1) {
      console.log('Zoom not active, returning');
      return;
    }
    
    if (!event.currentTarget) {
      console.log('No current target, returning');
      return;
    }
    
    // Simplificar - no usar throttling inicialmente para ver si funciona
    try {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const percentX = Math.max(0, Math.min(1, x / rect.width));
      const percentY = Math.max(0, Math.min(1, y / rect.height));
      
      console.log(`Applying zoom: scale(${zoomLevel}) at ${percentX * 100}%, ${percentY * 100}%`);
      
      // Aplicar transformación directamente
      target.style.setProperty('transform', `scale(${zoomLevel})`, 'important');
      target.style.setProperty('transform-origin', `${percentX * 100}% ${percentY * 100}%`, 'important');
      target.style.setProperty('z-index', '9999', 'important');
      target.style.setProperty('position', 'relative', 'important');
      
    } catch (error) {
      console.error('Error en handleMouseMove:', error);
    }
  };


const [mailCliente, setMailCliente] = useState('');
  const [mailValido, setMailValido] = useState(true);

const handleChangeMail = (e: { target: { value: any; }; }) => {
  const correo = e.target.value;
  setMailCliente(correo);

  // Expresión regular para validar el formato del correo electrónico
  const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const esValido = expresionRegular.test(correo);
  setMailValido(esValido);
};

//-----------------------Logica pedir presupuesto-----------------------------

//CREATE PRESUPUESTO


    // Estados locales para los campos del formulario
    const [nombreCliente, setNombreCliente] = useState('');
    const [apellidoCliente, setApellidoCliente] = useState('');
    //const [mailCliente, setMailCliente] = useState('');
    const [telefonoCliente, setTelefonoCliente] = useState(0);
    const [consultaPresupuesto, setConsultaPresupuesto] = useState('');

    // Estado para controlar la visibilidad de la alerta/modal
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
// Ref para el elemento donde se muestra el modal
const modalRef = useRef<HTMLDivElement>(null);

// Función para desplazarse hacia arriba cuando se muestra el modal
useEffect(() => {
  if (showSuccessMessage && modalRef.current) {
    window.scrollTo({ top: modalRef.current.offsetTop, behavior: 'smooth' });
  }
}, [showSuccessMessage]);
    
  
    // Manejador para el envío del formulario
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault(); // Evitar que el formulario se envíe automáticamente
  
      crearClienteYVisita(nombreCliente, apellidoCliente, mailCliente, telefonoCliente, consultaPresupuesto);
    };
  
    // Método al que se llama cuando se envía el formulario
    const crearClienteYVisita = async (nombreCliente: string, apellidoCliente: string, mailCliente: string, telefonoCliente: number, consultaPresupuesto: string) => {
      // Haz lo que necesites con los datos del formulario
      console.log('Nombre y apellido:', nombreCliente);
      console.log('Email:', apellidoCliente);
      console.log("Email:", mailCliente)
      console.log("Telefono:" , telefonoCliente);
      console.log('Número de contacto:', telefonoCliente);
      console.log('Consulta:', consultaPresupuesto);

      // Crear el cliente (solo datos, sin imágenes ni objetos anidados)
      const newCliente: Cliente = {
        id: 0, // O cualquier valor predeterminado que tu backend acepte
        nombreCliente: nombreCliente,
        apellidoCliente: apellidoCliente,
        mailCliente: mailCliente,
        telefonoCliente: telefonoCliente,
        fechaHoraAltaCliente: null, 
        fechaHoraModificacionCliente: null, 
        estadoCliente: "PENDIENTE",
        fechaHoraBajaCliente: null,  
      };

      // Crear la solicitud de visita (sin mueble ni cliente anidados)
      const newSolicitudVisita: SolicitarVisita = {
        id: 0,
        fechaHoraAltaSolicitarVisita: null,
        fechaHoraBajaSolicitarVisita: null,
        fechaHotaModificacionSolicitarVisita: null,
        consultaSolicitarVisita: consultaPresupuesto,
        mueble: null, // No enviar objeto mueble
        cliente: null, // No enviar objeto cliente
      }

      // Llamar al servicio pasando solo el id del mueble
      const newSolicitud = await SolicitarVisitaService.createSolicitarVisita(newSolicitudVisita, { id: mueble.id } as any, newCliente);
      console.log("Se a creado la solicitud:", newSolicitud)

      // Mostrar la alerta/modal de éxito
      setShowSuccessMessage(true);

      // Desplazar la página hacia donde se muestra el modal, si modalRef.current existe
      if (modalRef.current) {
        modalRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };


              

  

 

                return (
                  <div className="view-mueble">
                    {/* Fullscreen Modal */}
                    {showFullscreen && fullscreenImage && (
                      <div className="fullscreen-modal" onClick={handleCloseFullscreen}>
                        <div className="fullscreen-content">
                          <button className="fullscreen-close" onClick={handleCloseFullscreen}>
                            <i className="fas fa-times"></i>
                          </button>
                          <img
                            src={`data:image/png;base64, ${fullscreenImage.imagenes}`}
                            alt={mueble.nombreMueble}
                            className="fullscreen-image"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    )}

                    {/* Main Content */}
                    <div className="container-fluid py-5">
                      <div className="container">
                        <div className="row">
                          {/* Gallery Section */}
                          <div className="col-lg-8">
                            <div className="product-gallery">
                              {/* Main Image */}
                              <div className="main-image-container">
                                {imagenPrincipal && !loadingImages && (
                                  <div className={`main-image-wrapper ${isZooming ? 'zooming' : ''}`} style={{
                                    overflow: isZooming ? 'visible' : 'hidden',
                                    zIndex: isZooming ? 1000 : 1
                                  }}>
                                    <div className={`zoom-container ${isZooming ? 'zooming' : ''}`} style={{
                                      overflow: isZooming ? 'visible' : 'hidden',
                                      zIndex: isZooming ? 1001 : 1
                                    }}>
                                      <img
                                        key={imagenPrincipal.id}
                                        className={`main-image ${isZooming ? 'zooming' : ''}`}
                                        src={`data:image/png;base64, ${imagenPrincipal.imagenes}`}
                                        alt={mueble.nombreMueble}
                                        style={{
                                          transition: 'transform 0.1s ease-out',
                                          transformOrigin: 'center center',
                                          cursor: isZooming ? 'zoom-out' : 'zoom-in',
                                          position: 'relative',
                                          zIndex: isZooming ? 9999 : 1
                                        }}
                                        onClick={() => handleFullscreenImage(imagenPrincipal)}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        onMouseMove={handleMouseMove}
                                      />
                                    </div>
                                    <div className="zoom-indicator">
                                      <i className="fas fa-search-plus"></i>
                                      <span>Pasa el mouse para hacer zoom</span>
                                    </div>
                                  </div>
                                )}
                                {loadingImages && (
                                  <div className="loading-container">
                                    <div className="spinner"></div>
                                    <p>Cargando imágenes...</p>
                                  </div>
                                )}
                              </div>

                              {/* Thumbnail Gallery */}
                              <div className="thumbnail-gallery">
                                {imagenesFromBackend.map((imagen: MuebleImagenes) => (
                                  <div 
                                    key={imagen.id}
                                    className={`thumbnail-item ${imagenPrincipal?.id === imagen.id ? 'active' : ''}`}
                                    onClick={() => handleClickImagen(imagen)}
                                  >
                                    <img
                                      src={`data:image/png;base64, ${imagen.imagenes}`}
                                      alt={mueble.nombreMueble}
                                      className="thumbnail-image"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Product Details */}
                            <div className="product-details">
                              <div className="details-card">
                                <div className="card-header">
                                  <h2 className="product-title">{mueble.nombreMueble}</h2>
                                
                                </div>
                                
                                <div className="card-body">
                                  <p className="product-description">{mueble.descripcion}</p>
                                  
                                  <div className="product-specs">
                                    <div className="spec-grid">
                                      <div className="spec-item">
                                        <div className="spec-icon">
                                          <i className="fas fa-tree"></i>
                                        </div>
                                        <div className="spec-content">
                                          <h4>Tipo de Madera</h4>
                                          <p>{mueble.tipoMadera}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="spec-item">
                                        <div className="spec-icon">
                                          <i className="fas fa-palette"></i>
                                        </div>
                                        <div className="spec-content">
                                          <h4>Color</h4>
                                          <p>{mueble.colorMueble}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="spec-item">
                                        <div className="spec-icon">
                                          <i className="fas fa-ruler-combined"></i>
                                        </div>
                                        <div className="spec-content">
                                          <h4>Dimensiones</h4>
                                          <p>{mueble.dimension}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="spec-item">
                                        <div className="spec-icon">
                                          <i className="fas fa-dollar-sign"></i>
                                        </div>
                                        <div className="spec-content">
                                          <h4>Precio Referencial</h4>
                                          <p className="price">{mueble.precio}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Contact Form */}
                            <div className="contact-form-section">
                              <div className="form-card">
                                <div className="form-header">
                                  <h3>Solicitar Presupuesto</h3>
                                  <p>Completa el formulario y nos pondremos en contacto contigo</p>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="contact-form">
                                  <div className="form-row">
                                    <div className="form-group">
                                      <label htmlFor="nombre">Nombre</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        value={nombreCliente}
                                        onChange={(e) => setNombreCliente(e.target.value)}
                                        required
                                      />
                                    </div>
                                    
                                    <div className="form-group">
                                      <label htmlFor="apellido">Apellido</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="apellido"
                                        value={apellidoCliente}
                                        onChange={(e) => setApellidoCliente(e.target.value)}
                                        required
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="form-row">
                                    <div className="form-group">
                                      <label htmlFor="email">Email *</label>
                                      <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={mailCliente}
                                        onChange={handleChangeMail}
                                        required
                                      />
                                      {!mailValido && (
                                        <small className="error-message">El correo electrónico no es válido</small>
                                      )}
                                    </div>
                                    
                                    <div className="form-group">
                                      <label htmlFor="telefono">Teléfono (opcional)</label>
                                      <input
                                        type="tel"
                                        className="form-control"
                                        id="telefono"
                                        value={telefonoCliente || ''}
                                        onChange={(e) => setTelefonoCliente(e.target.valueAsNumber || 0)}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="form-group">
                                    <label htmlFor="consulta">Consulta</label>
                                    <textarea
                                      className="form-control"
                                      id="consulta"
                                      rows={4}
                                      value={consultaPresupuesto}
                                      onChange={(e) => setConsultaPresupuesto(e.target.value)}
                                      placeholder="Describe tu consulta: presupuesto específico, cambios de diseño, otras medidas, etc."
                                    />
                                  </div>
                                  
                                  <div className="form-actions">
                                    <button type="submit" className="btn btn-primary btn-lg">
                                      <i className="fas fa-paper-plane"></i>
                                      Enviar Consulta
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>

                          {/* Sidebar */}
                          <div className="col-lg-4">
                            <div className="sidebar">
                              {/* Product Summary */}
                              <div className="sidebar-card product-summary">
                                <div className="summary-header">
                                  <h3>{mueble.nombreMueble}</h3>
                                  <div className="rating">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <span>(Trabajo artesanal)</span>
                                  </div>
                                </div>
                                
                                <div className="summary-features">
                                  <div className="feature-item">
                                    <i className="fas fa-hammer"></i>
                                    <span>Hecho a mano</span>
                                  </div>
                                  <div className="feature-item">
                                    <i className="fas fa-leaf"></i>
                                    <span>Materiales naturales</span>
                                  </div>
                                  <div className="feature-item">
                                    <i className="fas fa-truck"></i>
                                    <span>Entrega a domicilio</span>
                                  </div>
                                  <div className="feature-item">
                                    <i className="fas fa-tools"></i>
                                    <span>Instalación incluida</span>
                                  </div>
                                </div>
                                
                                <div className="social-share">
                                  <h4>Síguenos en redes sociales</h4>
                                  <div className="social-links">
                                    <a href="https://www.facebook.com/Esteban.Chaparro028" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                                      <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="https://www.instagram.com/mdz.muebles/" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                                      <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="https://wa.me/542613663197" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                                      <i className="fab fa-whatsapp"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* Categories */}
                              <div className="sidebar-card categories">
                                <h4>Categorías</h4>
                                <div className="category-list">
                                  {categorias.map((categoria) => (
                                    <a key={categoria.id} href="/catalogo" className="category-item">
                                      <i className="fas fa-angle-right"></i>
                                      <span>{categoria.nombreCategoria}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>

                              {/* Process Info */}
                              <div className="sidebar-card process-info">
                                <h4>¿Cómo trabajamos?</h4>
                                <div className="process-steps">
                                  <div className="step">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                      <h5>Consulta</h5>
                                      <p>Completas el formulario con tus requerimientos</p>
                                    </div>
                                  </div>
                                  <div className="step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                      <h5>Visita</h5>
                                      <p>Visitamos tu hogar para tomar medidas exactas</p>
                                    </div>
                                  </div>
                                  <div className="step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                      <h5>Presupuesto</h5>
                                      <p>Te enviamos un presupuesto detallado</p>
                                    </div>
                                  </div>
                                  <div className="step">
                                    <div className="step-number">4</div>
                                    <div className="step-content">
                                      <h5>Creación</h5>
                                      <p>Fabricamos tu mueble con materiales de calidad</p>
                                    </div>
                                  </div>
                                </div>
                               
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Success Modal */}
                      {showSuccessMessage && (
                        <div className="success-modal-overlay">
                          <div className="success-modal" ref={modalRef}>
                            <div className="success-modal-header">
                              <h3 style={{ color: '#FFD600' }}>¡Solicitud enviada correctamente!</h3>
                              <button className="close-btn" onClick={() => setShowSuccessMessage(false)}>
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                            <div className="success-modal-body">
                              <div className="success-icon">
                                <i className="fas fa-check-circle"></i>
                              </div>
                              <p>
                                Gracias <strong>{nombreCliente} {apellidoCliente}</strong> por contactarte con nosotros. 
                                En breve nos comunicaremos contigo para coordinar una visita o brindarte un presupuesto personalizado.
                              </p>
                              <div className="contact-info">
                                <p><i className="fas fa-envelope"></i> También puedes escribirnos a nuestro email</p>
                                <p><i className="fas fa-phone"></i> O llamarnos directamente</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              
              }
              
              export default ViewMueble