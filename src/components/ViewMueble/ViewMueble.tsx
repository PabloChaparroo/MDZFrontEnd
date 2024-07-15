
import { useLocation, useParams } from "react-router-dom";
import { MuebleImagenes } from "../../types/MuebleImagenes";
import { useEffect, useRef, useState } from "react";
import { CategoriaService } from "../../services/CategoriaService";
import { Categoria } from "../../types/Categoria";
import { Mueble } from "../../types/Mueble";
import "./ViewMueble.css"
import { ClienteService } from "../../services/ClienteService";
import { Cliente } from "../../types/Cliente";
import { SolicitarVisitaService } from "../../services/SolicitarVisitaService";
import { SolicitarVisita } from "../../types/SolicitarVisita";
import { Button } from "react-bootstrap";







const ViewMueble = () => {





  const location = useLocation();
  const mueble = location.state.mueble;


  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la ventana hacia arriba al acceder a la página de inicio
  }, [location]); // Ejecuta el efecto cada vez que cambie la ubicación
  // Ahora puedes acceder a todos los atributos del objeto mueble
  console.log(mueble);

  

  const[isLoading, setIsLoading] = useState(true); 
  const [refreshData, setRefreshData] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() =>{
    //Llamamos a la funcion para obtener todos los muebles declarados en el Servicio
    const fetchCategoria= async() => {
      const categorias = await CategoriaService.getAllCategoria();
      setCategorias(categorias);
    setIsLoading(false)
    };
    fetchCategoria();
  }, [refreshData]);

  const [imagenPrincipal, setImagenPrincipal] = useState(mueble.imagenes.find((imagen: any) => imagen.esPortada));

  const handleClickImagen = (imagen: any) => {
    setImagenPrincipal(imagen);
  };
  

  const handleMouseEnter = () => {
    setZoomLevel(2); 
  };

  const handleMouseLeave = () => {
    setZoomLevel(1);
  };
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;

    // Calculamos la posición del mouse relativa a la imagen
    const percentX = x / width;
    const percentY = y / height;

    // Ajustamos el zoom
    const newZoomLevel = 1.4; // Puedes ajustar este valor según tus necesidades

    const maxOffsetX = (width * (newZoomLevel - 1)) / 4.5; // Máximo desplazamiento permitido en el eje X
    const maxOffsetY = (height * (newZoomLevel - 1)) / 4.5; // Máximo desplazamiento permitido en el eje Y
    
    // Calculamos el desplazamiento asegurándonos de no exceder los límites
    const offsetX = Math.min(Math.max((width * (newZoomLevel - 1)) * (0.5 - percentX), -maxOffsetX), maxOffsetX);
    const offsetY = Math.min(Math.max((height * (newZoomLevel - 1)) * (0.5 - percentY), -maxOffsetY), maxOffsetY);
    
 

    // Aplicamos transformaciones solo si el zoom cambia
    event.currentTarget.style.transform = `scale(${newZoomLevel}) translate(${offsetX}px, ${offsetY}px)`;
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



        
              // El cliente no existe, crear un nuevo cliente
              const newCliente: Cliente = {
                id: 0, // O cualquier valor predeterminado que tu backend acepte
                nombreCliente: nombreCliente,
                apellidoCliente: apellidoCliente,
                mailCliente: mailCliente,
                telefonoCliente: telefonoCliente,
                fechaHoraAltaCliente: null, 
                fechaHoraModificacionCliente: null, 
                estadoCliente: "ALTA",
                fechaHoraBajaCliente: null,  
              };
           
              const newSolicitudVisita: SolicitarVisita = {
                id: 0,
                fechaHoraAltaSolicitarVisita: null,
                fechaHoraBajaSolicitarVisita: null,
                fechaHotaModificacionSolicitarVisita: null,
                consultaSolicitarVisita: consultaPresupuesto,
                mueble: null,
                cliente: null,
              }
               
                    // Después de un tiempo, ocultamos el mensaje de éxito
                const newSolicitud = await SolicitarVisitaService.createSolicitarVisita(newSolicitudVisita, mueble, newCliente )
                console.log("Se a creado la solicitud:", newSolicitud)
                       
                // Mostrar la alerta/modal de éxito
                setShowSuccessMessage(true);
             
// Desplazar la página hacia donde se muestra el modal, si modalRef.current existe
if (modalRef.current) {
  modalRef.current.scrollIntoView({ behavior: 'smooth' });
  
}
  
                  
                };


              

  

 

                return (
    
                  <>

                
                 <div className="container-fluid py-5 animate__animated animate__fadeInUp">
                      <div className="container py-5 ">
                          <div className="row">
                              <div className="col-lg-8">
                                  
                                  <div className="pb-3 ">
                                      <div className="blog-item ">
                                      <div
                                  className="position-relative n"
                                  style={{ overflow: "hidden", position: "relative" }}
                                >
                                 <img
                                    key={imagenPrincipal.id}
                                    className="simg-fluid card-img-portada"
                                    src={`data:image/png;base64, ${imagenPrincipal.imagenes}`}
                                    alt={mueble.nombreMueble}
                                    style={{ transform: `scale(${zoomLevel})`, transition: "transform 0.1s",margin:"0 auto" }}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseMove={handleMouseMove}
                                  />
                                              
                                             
                                          </div>
                                      </div>
                                      <div className="bg-white mb-3" style={{padding: '30px'}}>
                                      <div className="d-flex mb-3">
                                      {mueble.imagenes.map((imagen: any, index: number) => (
                          <img
                          key={index}
                          className='imagen-mueble card simg-fluid card-img-thumbnail'
                          src={`data:image/png;base64, ${imagen.imagenes}`}
                          alt={mueble.nombreMueble}
                          onClick={() => handleClickImagen(imagen)}
                          style={{ cursor: 'pointer', marginRight: '10px' }}
                      />
                        ))}
                                            
                                          </div>
                                          <div className="bg-white mb-3 " style={{ padding: '30px', maxWidth: '600px' }}>
                                          <div className="d-flex mb-3">
                                              <a className="text-primary text-uppercase text-decoration-none" href="/">MDZ MUEBLES</a>
                                            
                                          </div>
                                          <h2 className="mb-3"> {mueble.nombreMueble}</h2>
                                         
                                          <p style={{ wordWrap: 'break-word' }}>{mueble.descripcion}</p> 
                                          
                                          
                                          <p>Tipo de madera: {mueble.tipoMadera}</p>
                                          <p>Color: {mueble.colorMueble}</p>
                                          <p>Tamaño: {mueble.dimension}</p>
                                          </div>
                                      </div>
                                  </div>
                                  
                  
                                  
                                  <div className="bg-white mb-3" style={{ padding: '30px' }}>
                  <h4 className="text-uppercase mb-4" style={{ letterSpacing: '5px' }}>SOLICITAR MUEBLE</h4>
              
                  <form onSubmit={handleSubmit}>
                  <div className="form-group">
                      <label htmlFor="name">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={nombreCliente}
                        onChange={(e) => setNombreCliente(e.target.value)}
                      />
                    </div>
              
                    <div className="form-group">
                      <label htmlFor="name">Apellido</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={apellidoCliente}
                        onChange={(e) => setApellidoCliente(e.target.value)}
                      />
                    </div>
              
                  
                    <div className="form-group">
                      <label htmlFor="mail">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="mail"
                        value={mailCliente}
                        onChange={handleChangeMail}
                      />
                      {/* Mostrar un mensaje de error si el correo no es válido */}
                      {!mailValido && <small className="text-danger">El correo electrónico no es válido</small>}
                    </div>
                    
                 
              
                    
                    <div className="form-group">
                      <label htmlFor="number">Numero de contacto (opcional)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="number"
                        value={telefonoCliente}
                        onChange={(e) => setTelefonoCliente(e.target.valueAsNumber)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="text">Solicita un presupuesto específico para el mueble que están visualizando, programando una visita para un diseño completamente nuevo o simplemente haciendo otras consultas sobre el mueble en cuestión </label>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        value={consultaPresupuesto}
                        onChange={(e) => setConsultaPresupuesto(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-0">
                      <input
                        type="submit"
                        value="Enviar"
                        className="btn btn-primary font-weight-semi-bold py-2 px-3"
                      />
                    </div>
                  </form>
              </div>
              
                        
                              </div>
                  
                              <div className="col-lg-4 mt-5 mt-lg-0">
                                
                                  <div className="d-flex flex-column text-center bg-white mb-5 py-5 px-4">
                            
                                      
                                      <h3 className="text-primary mb-3">{mueble.nombreMueble}</h3>
                                     
                                      <div className='p-4'>
                                  <div className='d-flex justify-content-between mb-3'>
                                    <small className='m-0'><i className='fas fa-couch text-primary mr-2'></i>{mueble.tipoMadera}</small>
                                  <div className='d-flex justify-content-between mb-3'>
                                    <small className='m-0'><i className='fas fa-ruler text-primary mr-2'></i>{mueble.dimension}</small>
                                    </div>
                                  </div>
                                 
                                  <div className='border-top mt-4 pt-4'>
                                    <div className='d-flex justify-content-between'>
                                      <h6 className='m-0'><i className='fas fa-paint-brush text-primary mr-2'></i>{mueble.colorMueble}</h6>
                                      <h6 className='m-0'><i className='fas fa-ruler text-primary mr-2'></i>{mueble.precio}</h6>
              
                                    </div>
                                    
              
                                    </div>
                                    
                                    
                                </div>
                                      <div className="d-flex justify-content-center">
                                          <a className="text-primary px-2" href="https://www.facebook.com/Esteban.Chaparro028">
                                              <i className="fab fa-facebook-f"></i>
                                          </a>
                                  
                                          <a className="text-primary px-2" href="">
                                              <i className="fab fa-instagram"></i>
                                          </a>
                                         
                                      </div>
                                  </div>
                  
                        
                                 


                                             
                                  <div className="mb-5">
                                      <h4 className="text-uppercase mb-4" style={{letterSpacing: '5px'}}>Categories</h4>
                                      <div className="bg-white" style={{padding: '30px'}}>
                                          <ul className="list-inline m-0">
                                              <li className="mb-3 d-flex justify-content-between align-items-center">
                                                  <a className="text-dark" href="../catalogo"><i className="fa fa-angle-right text-primary mr-2"></i> {categorias.filter(categoria => categoria.id === 1).map(categoria => categoria.nombreCategoria)}</a>
                                                  <span className="badge badge-primary badge-pill">150</span>
                                              </li>
                                              <li className="mb-3 d-flex justify-content-between align-items-center">
                                              <a className="text-dark" href="../catalogo"><i className="fa fa-angle-right text-primary mr-2"></i> {categorias.filter(categoria => categoria.id === 2).map(categoria => categoria.nombreCategoria)}</a>
                                                     
                                                  <span className="badge badge-primary badge-pill">131</span>
                                              </li>
                                              <li className="mb-3 d-flex justify-content-between align-items-center">
                                              <a className="text-dark" href="../catalogo"><i className="fa fa-angle-right text-primary mr-2"></i> {categorias.filter(categoria => categoria.id === 3).map(categoria => categoria.nombreCategoria)}</a>
                                                  <span className="badge badge-primary badge-pill">78</span>
                                              </li>
                                              <li className="mb-3 d-flex justify-content-between align-items-center">
                                              <a className="text-dark" href="../catalogo"><i className="fa fa-angle-right text-primary mr-2"></i> {categorias.filter(categoria => categoria.id === 4).map(categoria => categoria.nombreCategoria)}</a>
                                                  <span className="badge badge-primary badge-pill">56</span>
                                              </li>
                                              <li className="d-flex justify-content-between align-items-center">
                                              <a className="text-dark" href="../catalogo"><i className="fa fa-angle-right text-primary mr-2"></i> {categorias.filter(categoria => categoria.id === 5).map(categoria => categoria.nombreCategoria)}</a>
                                                  <span className="badge badge-primary badge-pill">98</span>
                                              </li>
                                          </ul>
                                      </div>
                                  </div>
                  
                              
                                  <div className="mb-2">
                                      <h4 className="text-uppercase mb-5" style={{letterSpacing: '6px'}}>¿Cómo pedir solicitar una visita?</h4>
                                      <a className="d-flex align-items-center text-decoration-none bg-white mb-3" href="/">
                                          <img className="img-fluid" src="img/blog-100x100.jpg" alt=""/>
                                          <div className="pl-3">
                                              <h6 className="d-flex align-items-center text-decoration-none bg-white mb-3">Cada mueble visualizado en el catalogo son imagenes reales de trabajos realizados a medida para cada cliente, puedes consultar presupuesta para otras medidas, colores o incluso otros diseño. </h6>
                                              <h6 className="text-dark bg-white mb-3">Se notificara el presupuesto por vía Cliente </h6>
                                          </div>
                                   </a>
                                     
                                  </div>
                  
                                 
                                 
                              </div>
                          </div>
                      </div>

              
                      {/* Alerta/modal de éxito */}
                      {showSuccessMessage && (
                        


                      <div>
                        <div className="row"> 
                          <div className="col-lg-8">
                            <div className="pb-3 ">
                              <div className="modal fade show" style={{ display: 'block', backgroundColor: '#fff', padding: '20px', borderRadius: '5px' }} ref={modalRef}>
                                <div className="modal-header">
                                  <h5 className="modal-title">Solicitud enviada correctamente</h5>
                                  <button type="button" className="close" onClick={() => setShowSuccessMessage(false)}>
                                    <span>&times;</span>
                                  </button>
                          </div>
                          <div className="bg-white mb-3 " style={{ padding: '30px', maxWidth: '600px' }}>
                                          
                                         
                                         <p>
                                          Gracias {nombreCliente} {apellidoCliente} por contactarte con nosotros, en breve nos comunicaremos contigo ya sea por telefono o vía mail para organizar una visita.
                                         </p>
                                          
                                          
                                          
                                          <p>No dudes en visitar nuestro redes sociales</p>
                                        
                                          </div>
                        </div>
                        </div>
                        </div>
                        </div>
                      </div>
                    )}
                  </div>
              
                
                    
                  </>
                  
                )
              
              }
              
              export default ViewMueble