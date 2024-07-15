import { Carousel } from "react-bootstrap";
import '../CarouselHome/CarouselHome.css';
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


const CarouselHome = () => {

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la ventana hacia arriba al acceder a la página de inicio
  }, [location]); // Ejecuta el efecto cada vez que cambie la ubicación

  //Refrezcar imagen
  const [timestamp, setTimestamp] = useState(Date.now());

// useEffect con un array de dependencias vacío se ejecuta solo una vez, equivalente a componentDidMount
useEffect(() => {
  const interval = setInterval(() => {
    // Actualizamos el timestamp cada 30 segundos
    setTimestamp(Date.now());
  }, 10000); // Intervalo de 10 segundos
// Devolvemos una función de limpieza para detener el intervalo cuando el componente se desmonta
return () => clearInterval(interval);
}, []); // Array de dependencias vacío


  return (/*
    <>
     
    <Carousel fade className=" animate__animated animate__fadeIn">
      <Carousel.Item>
        <div className="carousel-image" style= {{backgroundImage: `url("src/assets/images/portada.webp")`}}>
          <Carousel.Caption className="caption-center">
            <h2 className="carousel-heading">MDZ Muebles a tu medida</h2>
            <p className="d-inline-flex text-white">Somos una empresa especializada en construir y diseñar muebles a medida.</p>
          </Carousel.Caption>
        </div>
      </Carousel.Item>
      

      <Carousel.Item>
      <div className="carousel-image" style={{backgroundImage: `url("src/assets/images/portada 4.jpeg")`}}>
        <Carousel.Caption className="caption-center">
          <h2 className="carousel-heading">Gran variedad de productos</h2>
          <p className="carousel-description">Tenemos una gran catidad de producto a elección.</p>
        </Carousel.Caption>
        </div>
      </Carousel.Item>
      

      <Carousel.Item>
      <div className="carousel-image" style={{backgroundImage: `url("src/assets/images/pexels-photo-2089698.jpeg")`}}>
        <Carousel.Caption className="caption-center">
          <h2 className="carousel-heading">Proximamente en todo el país</h2>
          <p className="carousel-description">Sucursal en Mendoza Argentina.</p>
        </Carousel.Caption>
        </div>
      </Carousel.Item>
    </Carousel>
    
    <div className="container-fluid py-5">
        <div className="container pt-5">
          <div className="row">
            <div className="col-lg-6" style={{ minHeight: '500px' }}>
              <div className="position-relative h-100">
                <img className="position-absolute w-100 h-100" src="src/assets/images/placar3.jpg" style={{ objectFit: 'cover' }} alt="About" />
              </div>
            </div>
            <div className="col-lg-6 pt-5 pb-lg-5">
              <div className="about-text bg-white p-4 p-lg-5 my-lg-5">
                <h6 className="text-primary text-uppercase" style={{ letterSpacing: '5px' }}>About Us</h6>
                <h1 className="mb-3">We Provide Best Tour Packages In Your Budget</h1>
                <p>Dolores lorem lorem ipsum sit et ipsum. Sadip sea amet diam dolore sed et. Sit rebum labore sit sit ut vero no sit. Et elitr stet dolor sed sit et sed ipsum et kasd ut. Erat duo eos et erat sed diam duo</p>
                <div className="row mb-4">
                  <div className="col-6">
                    <img className="img-fluid" src="src/assets/images/tele1.jpg" alt="About 1" />
                  </div>
                  <div className="col-6">
                    <img className="img-fluid" src="src/assets/images/biblioteca1.jpg" alt="About 2" />
                  </div>
                </div>
                <a href="#" className="btn btn-primary mt-1">Book Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>*/
    <>
<header className="header animate__animated animate__backInUp">
        <div className="container">
            
            <div className="header-content">
              
                <h4 className="header-subtitle" >Muebles a tu medida</h4>
                <h3 className="header-title">MDZ MUEBLES</h3>
                <h6 className="header-mono" >Tu visión, nuestra creación: descubre cómo hacemos realidad tus sueños de decoración</h6>
                <a href="/catalogoq" className="btn btn-primary btn-rounded">
                <i className="ti-printer pr-0"></i> Ver muebles
                </a>

            </div>
        </div>
    </header>




    <div className="container-fluid py-5 animate__animated animate__backInUp">
        <div className="container pt-5">
          <div className="row">
            <div className="col-lg-6" style={{ minHeight: '500px' }}>
              <div className="position-relative h-100">
                <img className="position-absolute w-100 h-100" src="src/assets/images/placar3.jpg" style={{ objectFit: 'cover' }} alt="About" />
              </div>
            </div>
            <div className="col-lg-6 pt-5 pb-lg-5">
              <div className="about-text bg-white p-4 p-lg-5 my-lg-5">
                <h6 className="text-primary text-uppercase" style={{ letterSpacing: '5px' }}>Nuestra empresa</h6>
                <h1 className="mb-3">Descubre MDZ Muebles: Expertos en Muebles a Medida</h1>
                <p>Nos dedicamos a diseñar y fabricar muebles a medida que se adapten perfectamente a tus necesidades y gustos individuales. Nuestro equipo de expertos trabaja con atención al detalle y pasión por el diseño para crear piezas que no solo sean funcionales, sino también estéticamente hermosas. Explora nuestro catálogo y descubre cómo podemos transformar tu espacio en algo verdaderamente extraordinario"</p>
                <div className="row mb-4">
                  <div className="col-6">
                  <img className="img-fluid" src={`src/assets/images/tele1.jpg?timestamp=${timestamp}`} alt="" />
                  </div>
                  <div className="col-6">
                    <img className="img-fluid" src="src/assets/images/biblioteca1.jpg" alt="About 2" />
                  </div>
                </div>
                <a href="/catalogo" className="btn btn-primary mt-1">Leer más</a>
              </div>
            </div>
          </div>
        </div>
      </div>




      <div className="container-fluid py-5">
        <div className="container pt-5 pb-3">
            <div className="text-center mb-3 pb-3">
                <h6 className="text-primary text-uppercase" >MUEBLES</h6>
                <h1>Explora Nuestro Catalogo</h1>
            </div>
            <div className="row">

                

                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="destination-item position-relative overflow-hidden mb-2">
                    
                    
                      <img className="img-fluid"
                        src="https://www.dxxi.com.ar/wp-content/uploads/2017/05/dxxi-loft-cama-web-01.jpg"
                        alt=""
                      />
                      <a className="destination-overlay text-white text-decoration-none" href="/catalogo">
                        <h5 className="text-white">Camas</h5>
                        <span>+100 Muebles</span>
                      </a>
                   </div>
                </div>
                
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="destination-item position-relative overflow-hidden mb-2">
                        <img className="img-fluid" src="https://www.dxxi.com.ar/wp-content/uploads/2016/09/Mueble-TV-Tetris-Web-02.jpg" alt=""/>
                        <a className="destination-overlay text-white text-decoration-none" href="/catalogo">
                            <h5 className="text-white">Muebles Para TV</h5>
                            <span>+100 Muebles</span>
                        </a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="destination-item position-relative overflow-hidden mb-2">
                        <img className="img-fluid" src="https://www.dxxi.com.ar/wp-content/uploads/2021/06/dxxi-cuna-funcional-rearte-web-01.jpg" alt=""/>
                        <a className="destination-overlay text-white text-decoration-none" href="/catalogo">
                            <h5 className="text-white"> Muebles Infantilies</h5>
                            <span>+100 Muebles</span>
                        </a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="destination-item position-relative overflow-hidden mb-2">
                        <img className="img-fluid" src="https://www.dxxi.com.ar/wp-content/uploads/2016/09/Mesa-de-luz-Vintage-Web-01.jpg" alt=""/>
                        <a className="destination-overlay text-white text-decoration-none" href="/catalogo">
                            <h5 className="text-white">Mesas De Luz</h5>
                            <span>+100 Muebles</span>
                        </a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="destination-item position-relative overflow-hidden mb-2">
                        <img className="img-fluid" src="https://www.dxxi.com.ar/wp-content/uploads/2020/07/dxxi-ropero-nina-web-03.jpg" alt=""/>
                        <a className="destination-overlay text-white text-decoration-none" href="/catalogo">
                            <h5 className="text-white">Placares</h5>
                            <span>+100 Muebles</span>
                        </a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="destination-item position-relative overflow-hidden mb-2">
                        <img className="img-fluid" src="https://www.dxxi.com.ar/wp-content/uploads/2020/02/dxxi-escritorio-Tesla-web-01.jpg" alt=""/>
                        <a className="destination-overlay text-white text-decoration-none" href="/catalogo">
                            <h5 className="text-white">Escritorios</h5>
                            <span>+100 Muebles</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    
</div>




{/* Contactanos */}
    <div className="container-fluid bg-registration py-5" style={{margin: '90px 0'}}>
        <div className="container py-5">
            <div className="row align-items-center">
                <div className="col-lg-7 mb-5 mb-lg-0">
                    <div className="mb-4">
                        <h6 className="text-primary-white text-uppercase" style={{letterSpacing: '5px'}}>MDZ Muebles</h6>
                        <h1 className="text-white"><span className="text-primary-consulta">Consulta</span> Tus dudas</h1>
                    </div>
                    <p className="text-white">Si tienes alguna pregunta o consulta no dudes en contactarnos.
                    Para enviarnos tu consulta, simplemente completa el formulario y en breve nos comunicaremos contigo. </p>
                    <ul className="list-inline text-white m-0">
                        <li className="py-2"><i className="fa fa-check text-primary-consulta mr-3"></i>Calidad en productos</li>
                        <li className="py-2"><i className="fa fa-check text-primary-consulta mr-3"></i>Atención al cliente</li>
                        <li className="py-2"><i className="fa fa-check text-primary-consulta mr-3"></i>Bienestar y comodidad</li>
                    </ul>
                </div>
                <div className="col-lg-5">
                    <div className=" border-0">
                        <div className="card-header bg-primary text-center p-4">
                            <h1 className="text-white m-0">Contactanos</h1>
                        </div>
                        <div className="card-body rounded-bottom bg-white p-5">
                            <form>
                                <div className="form-group">
                                    <input type="text" className="form-control p-4" placeholder="Nombre"  />
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control p-4" placeholder="Apellido"  />
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control p-4" placeholder="Email"  />
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control p-4" placeholder="Telefono(opcional)"  />
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control p-4" placeholder="Consulta"  />
                                </div>
                                <div>
                                    <button className="btn btn-primary-enviar btn-block py-3 text-center " type="submit">Enviar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    </>

  );
}

export default CarouselHome;
