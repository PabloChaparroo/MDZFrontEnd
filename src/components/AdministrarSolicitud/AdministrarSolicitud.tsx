import { useEffect, useState } from "react"
import { ConsultaService } from "../../services/ConsultaService"
import { Consulta } from "../../types/Consulta"
import { Table, Button } from "react-bootstrap";
import Pagination from "../Pagination/Pagination";
import ResponderConsultaModal from "./ResponderConsultaModal";
import VerMuebleModal from "./VerMuebleModal";
import "./AdministrarSolicitud.css";

// Enum para los diferentes tipos de vista
enum VistaActual {
  CON_MUEBLE = 'CON_MUEBLE',
  GENERALES = 'GENERALES'
}

const AdministrarSolicitud = () => {

    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [vistaActual, setVistaActual] = useState<VistaActual>(VistaActual.CON_MUEBLE);

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

   // Estados para los modales de acciones
   const [consultaParaResponder, setConsultaParaResponder] = useState<Consulta | null>(null);
   const [consultaParaVerMueble, setConsultaParaVerMueble] = useState<Consulta | null>(null);

   // Estado para búsqueda
   const [busquedaNombre, setBusquedaNombre] = useState('');
   const [isSearching, setIsSearching] = useState(false);
   const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

   useEffect(() => {
     if (busquedaNombre.trim() !== '') {
       handleFiltrarPorNombre(busquedaNombre, currentPage - 1);
     } else {
       fetchConsultas();
     }
     // eslint-disable-next-line
   }, [currentPage]);

   // Búsqueda con debounce
   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const valor = e.target.value;
     setBusquedaNombre(valor);
     if (searchTimeout) clearTimeout(searchTimeout);
     if (!valor.trim()) {
       setIsSearching(false);
       setCurrentPage(1);
       return;
     }
     setIsSearching(true);
     const timeout = setTimeout(() => {
       handleFiltrarPorNombre(valor, 0);
     }, 400);
     setSearchTimeout(timeout);
   };

   const handleFiltrarPorNombre = async (nombre: string, pagina = 0) => {
     try {
       setIsSearching(true);
       const response = await ConsultaService.filtrarPorNombre(nombre, pagina);
       setConsultas(response.content);
       setTotalPages(response.totalPages);
       setTotalElements(response.totalElements);
     } catch (error) {
       setConsultas([]);
     } finally {
       setIsSearching(false);
     }
   };

   const fetchConsultas = async () => {
    try {
      setIsLoading(true);
      const response = await ConsultaService.obtenerConsultasPaginadas(currentPage - 1);
      setConsultas(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error al obtener consultas:', error);
      setConsultas([]);
    } finally {
      setIsLoading(false);
    }
   };

   const handleClickVista = (vista: VistaActual) => {
    setVistaActual(vista);
   };

   const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const refrescar = () => {
    if (busquedaNombre.trim() !== '') {
      handleFiltrarPorNombre(busquedaNombre, currentPage - 1);
    } else {
      fetchConsultas();
    }
   };

   const getTituloVista = () => {
    switch (vistaActual) {
      case VistaActual.CON_MUEBLE:
        return 'Consultas de Muebles';
      case VistaActual.GENERALES:
        return 'Consultas Generales';
      default:
        return 'Administrar Consultas';
    }
   };

   // La API devuelve todas las consultas juntas; separamos en pantalla
   // según si tienen un mueble asociado o son consultas generales.
   const consultasConMueble = consultas.filter(c => c.mueble != null);
   const consultasGenerales = consultas.filter(c => c.mueble == null);
   const consultasVisibles = vistaActual === VistaActual.CON_MUEBLE ? consultasConMueble : consultasGenerales;

  return (
    <div className="administrar-solicitud">
      {/* Hero Section */}
         <div className="catalog-header fade-in-up">
              <h1 className="catalog-title">
                <i className="fas fa-cogs me-3"></i>
                Administración de Consultas
              </h1>

              <p className="catalog-subtitle">
              Sistema de gestión de consultas de clientes sobre muebles del catálogo y consultas generales
            </p>
            <hr/>
            <div className="about-hero-divider"></div>
         </div>

      {/* Botones de navegación */}
      <div className="btn-group fade-in" role="group" aria-label="Navegación">
        <button
          className={`category-text ${vistaActual === VistaActual.CON_MUEBLE ? 'bg-warning text-dark' : 'bg-black'}`}
          onClick={() => handleClickVista(VistaActual.CON_MUEBLE)}
        >
          <i className="fas fa-couch me-2"></i>
          Consultas de Muebles
        </button>
        <button
          className={`category-text ${vistaActual === VistaActual.GENERALES ? 'bg-warning text-dark' : 'bg-black'}`}
          onClick={() => handleClickVista(VistaActual.GENERALES)}
        >
          <i className="fas fa-comments me-2"></i>
          Consultas Generales
        </button>
      </div>

      {/* Título de la vista actual */}
      <div className="section-header fade-in">
        <h2 className="section-title">
          <i className={`fas ${
            vistaActual === VistaActual.CON_MUEBLE ? 'fa-couch' : 'fa-comments'
          }`}></i>
          {getTituloVista()}
        </h2>
        <div className="section-meta">
          Página {currentPage} de {totalPages} | Total: {totalElements} consultas
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando datos...</p>
        </div>
      )}

      {/* Buscador por nombre */}
      <div className="search-container fade-in-up" style={{ maxWidth: 400, margin: '0 auto 20px auto' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre de cliente..."
          value={busquedaNombre}
          onChange={handleSearchChange}
          style={{ borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
        />
        {isSearching && (
          <div style={{ color: '#b8860b', marginTop: 5 }}>
            <i className="fas fa-spinner fa-spin me-2"></i>Buscando...
          </div>
        )}
      </div>

      {/* Tabla principal */}
      {!isLoading && (
        <div className="table-container fade-in">
          <div className="table-responsive">
            <Table hover className="professional-table">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Fecha</th>
                  <th>Consulta</th>
                  {vistaActual === VistaActual.CON_MUEBLE && <th>Mueble</th>}
                  <th>Respuesta</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {consultasVisibles.length === 0 ? (
                  <tr>
                    <td colSpan={vistaActual === VistaActual.CON_MUEBLE ? 8 : 7} className="text-center py-5">
                      <div className="empty-state">
                        <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted">No hay consultas disponibles</h5>
                        <p className="text-muted">Las consultas aparecerán aquí cuando los clientes las envíen</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  consultasVisibles.map((consulta) => (
                    <tr key={consulta.id} className="slide-in">
                      <td>
                        <span className="badge bg-success">#{consulta.id}</span>
                      </td>
                      <td>
                        <div className="client-info">
                          <strong>{consulta.cliente?.nombreCliente} {consulta.cliente?.apellidoCliente}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div><i className="fas fa-envelope me-1"></i> {consulta.cliente?.mailCliente}</div>
                          <div><i className="fas fa-phone me-1"></i> {consulta.cliente?.telefonoCliente || 'N/A'}</div>
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          {consulta.fechaHoraAltaConsulta ?
                            new Date(consulta.fechaHoraAltaConsulta).toLocaleDateString() :
                            'N/A'
                          }
                        </div>
                      </td>
                      <td>
                        <div
                          className="consultation-text"
                          title={consulta.mensajeConsulta || ''}
                          style={{
                            maxWidth: '220px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {consulta.mensajeConsulta}
                        </div>
                      </td>
                      {vistaActual === VistaActual.CON_MUEBLE && (
                        <td>
                          <div className="product-info">
                            <strong>{consulta.mueble?.nombreMueble || 'Sin mueble'}</strong>
                          </div>
                        </td>
                      )}
                      <td>
                        {consulta.respuesta ? (
                          <span className="badge bg-success">
                            <i className="fas fa-check me-1"></i>Respondida
                          </span>
                        ) : (
                          <span className="badge bg-warning">
                            <i className="fas fa-hourglass-half me-1"></i>Pendiente
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {consulta.mueble && (
                            <Button
                              size="sm"
                              variant="outline-dark"
                              title="Ver mueble consultado"
                              onClick={() => setConsultaParaVerMueble(consulta)}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant={consulta.respuesta ? "outline-secondary" : "warning"}
                            title={consulta.respuesta ? "Ver / reenviar respuesta" : "Responder consulta"}
                            onClick={() => setConsultaParaResponder(consulta)}
                          >
                            <i className="fas fa-reply me-1"></i>
                            {consulta.respuesta ? 'Ver respuesta' : 'Responder'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {consultaParaResponder && (
        <ResponderConsultaModal
          show={Boolean(consultaParaResponder)}
          onHide={() => setConsultaParaResponder(null)}
          consulta={consultaParaResponder}
          onRespondida={refrescar}
        />
      )}

      {consultaParaVerMueble && consultaParaVerMueble.mueble && (
        <VerMuebleModal
          show={Boolean(consultaParaVerMueble)}
          onHide={() => setConsultaParaVerMueble(null)}
          mueble={consultaParaVerMueble.mueble}
        />
      )}
    </div>
  );
}

export default AdministrarSolicitud
