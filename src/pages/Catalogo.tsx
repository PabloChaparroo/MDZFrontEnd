import { Container } from "react-bootstrap";
import CatalogoGrid from "../components/Catalogo/CatalogoGrid";

const Catalogo = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-1">Catálogo de muebles a medida</h1>
      <p className="text-muted mb-4">
        Elegí el mueble que más te gusta y consultanos por medidas, colores y terminaciones.
      </p>
      <CatalogoGrid />
    </Container>
  )
}

export default Catalogo
