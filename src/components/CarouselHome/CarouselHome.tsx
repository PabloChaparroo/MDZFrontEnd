import { Carousel } from "react-bootstrap"


const CarouselHome = () => {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img 
        className="d-block w-100" 
        style={{maxHeight: "500px", objectFit: 'cover'}} 
        src="src/assets/images/portada.webp" alt="slide1" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>


      <Carousel.Item>
      <img className="d-block w-100" style={{maxHeight: "500px", objectFit: 'cover'}} src="src/assets/images/portada 4.jpeg" alt="slide2" />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>


      <Carousel.Item>
      <img className="d-block w-100" style={{maxHeight: "500px", objectFit: 'cover'}} src="src/assets/images/pexels-photo-2089698.jpeg" alt="slide3" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselHome;
