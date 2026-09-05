import { useEffect, useState } from "react";
import { Button, Card, Col, Pagination, Row } from "react-bootstrap";
import { MuebleService } from "../../services/MuebleService";
import { CatalogoMueble } from "../../types/CatalogoMueble";
import Loader from "../Loader/Loader";
import MuebleDetalleModal from "./MuebleDetalleModal";

const CatalogoGrid = () => {
    const [muebles, setMuebles] = useState<CatalogoMueble[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [muebleSeleccionado, setMuebleSeleccionado] = useState<CatalogoMueble | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMuebles = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const pagina = await MuebleService.getCatalogoCompleto(page);
                setMuebles(pagina.content);
                setTotalPages(pagina.totalPages);
            } catch (err) {
                console.error(err);
                setError("No pudimos cargar el catálogo. Probá recargar la página.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMuebles();
    }, [page]);

    if (isLoading) return <Loader />;

    if (error) {
        return <div className="text-center text-danger py-5">{error}</div>;
    }

    if (muebles.length === 0) {
        return <div className="text-center text-muted py-5">Todavía no hay muebles cargados en el catálogo.</div>;
    }

    return (
        <>
            <Row xs={1} sm={2} md={3} className="g-4">
                {muebles.map((mueble) => (
                    <Col key={mueble.id}>
                        <Card className="h-100 shadow-sm">
                            {mueble.imagenPortada ? (
                                <Card.Img
                                    variant="top"
                                    src={`data:image/jpeg;base64,${mueble.imagenPortada}`}
                                    style={{ height: "220px", objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                    className="bg-light d-flex align-items-center justify-content-center text-muted"
                                    style={{ height: "220px" }}
                                >
                                    Sin imagen
                                </div>
                            )}
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{mueble.nombreMueble}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{mueble.nombreCategoria}</Card.Subtitle>
                                <Card.Text className="flex-grow-1" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {mueble.descripcion}
                                </Card.Text>
                                <Button variant="outline-primary" onClick={() => setMuebleSeleccionado(mueble)}>
                                    Ver más y consultar
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {totalPages > 1 && (
                <Pagination className="justify-content-center mt-4">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            )}

            {muebleSeleccionado && (
                <MuebleDetalleModal
                    show={Boolean(muebleSeleccionado)}
                    onHide={() => setMuebleSeleccionado(null)}
                    mueble={muebleSeleccionado}
                />
            )}
        </>
    );
};

export default CatalogoGrid;
