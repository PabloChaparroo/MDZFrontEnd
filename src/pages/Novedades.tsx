import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import Pagination from "../components/Pagination/Pagination";
import { MuebleService } from "../services/MuebleService";
import { Mueble } from "../types/Mueble";
import '../styles/mdz-theme.css';
import '../styles/mdz-site.css';

// fechaAltaMueble llega como "yyyy-MM-dd HH:mm:ss"
function formatearFecha(fecha: string | null): string {
  if (!fecha) return '';
  const date = new Date(fecha.replace(' ', 'T'));
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const Novedades = () => {
  const [publicaciones, setPublicaciones] = useState<Mueble[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchNovedades = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await MuebleService.getNovedades(currentPage);
        setPublicaciones(response.content || []);
        setTotalPages(response.totalPages || 0);
      } catch (error) {
        console.error('Error al cargar novedades:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNovedades();
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <>
      <div className="mdz-page-header mdz-diagonal-detail">
        <div className="mdz-container">
          <p className="mdz-eyebrow">Novedades</p>
          <h1>Lo último del taller.</h1>
          <p className="mdz-section-copy">Los muebles más recientes que sumamos.</p>
        </div>
      </div>

      <div className="mdz-container mdz-section">
        {isLoading ? (
          <div className="mdz-loading-state"><Loader /></div>
        ) : hasError ? (
          <div className="mdz-empty-state"><p>No pudimos cargar las novedades. Intentá nuevamente.</p></div>
        ) : publicaciones.length === 0 ? (
          <div className="mdz-empty-state"><p>Todavía no hay publicaciones.</p></div>
        ) : (
          <div className="mdz-feed">
            {publicaciones.map((mueble) => (
              <article className="mdz-post" key={mueble.id}>
                <header className="mdz-post-header">
                  <span className="mdz-post-category">{mueble.nombreCategoria}</span>
                  <time dateTime={mueble.fechaAltaMueble?.replace(' ', 'T')}>{formatearFecha(mueble.fechaAltaMueble)}</time>
                </header>
                <Link className="mdz-post-image" to={`/ViewMueble/${mueble.id}`} state={{ mueble }}>
                  {typeof mueble.imagenPortada === 'string' && (
                    <img src={`data:image/jpeg;base64,${mueble.imagenPortada}`} alt={mueble.nombreMueble} loading="lazy" />
                  )}
                </Link>
                <div className="mdz-post-body">
                  <h2>{mueble.nombreMueble}</h2>
                  <p>{mueble.colorMueble}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isLoading={isLoading} />
        )}
      </div>
    </>
  );
};

export default Novedades;
