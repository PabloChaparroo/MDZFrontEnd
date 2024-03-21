import { Carousel } from "react-bootstrap"
import '../CarouselHome/CarouselHome.css'

const CarouselHome = () => {
  return (
    <Carousel fade className="animate__animated animate__fadeIn">
      <Carousel.Item>
        <div className="carousel-image" style={{backgroundImage: `url("src/assets/images/portada.webp")`}}>
          <Carousel.Caption>
            <h2>MDZ Muebles a tu medida</h2>
            <p>Somos una empresa especializada en construir y diseñar muebles a medida.</p>
          </Carousel.Caption>
        </div>
      </Carousel.Item>
      

      <Carousel.Item>
      <div className="carousel-image" style={{backgroundImage: `url("src/assets/images/portada 4.jpeg")`}}>
        <Carousel.Caption>
          <h2>Gran variedad de productos</h2>
          <p>Tenemos una gran catidad de producto a elección.</p>
        </Carousel.Caption>
        </div>
      </Carousel.Item>
      

      <Carousel.Item>
      <div className="carousel-image" style={{backgroundImage: `url("src/assets/images/pexels-photo-2089698.jpeg")`}}>
        <Carousel.Caption>
          <h3>Proximamente en todo el país</h3>
          <p>
            Sucursal en Mendoza Argentina.
          </p>
          
        </Carousel.Caption>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselHome;
