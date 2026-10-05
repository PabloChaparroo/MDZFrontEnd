import { useEffect, useState } from "react"
import { ConsultaService } from "../../services/ConsultaService"
import { Consulta } from "../../types/Consulta"
import Pagination from "../Pagination/Pagination";
import ResponderConsultaModal from "./ResponderConsultaModal";
import VerMuebleModal from "./VerMuebleModal";
import Loader from "../Loader/Loader";
import '../../styles/mdz-theme.css';
import '../../styles/mdz-site.css';

enum VistaActual {
  CON_MUEBLE = 'CON_MUEBLE',
  GENERALES = 'GENERALES'
}

const AdministrarSolicitud = () => {

    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [vistaActual, setVistaActual] = useState<VistaActual>(VistaActual.CON_MUEBLE);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

   const [consultaParaResponder, setConsultaParaResponder] = useState<Consulta | null>(null);
   const [consultaParaVerMueble, setConsultaParaVerMueble] = useState<Consulta | null>(null);

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

   // La API devuelve todas las consultas juntas; separamos en pantalla
   // según si tienen un mueble asociado o son consultas generales.
   const consultasConMueble = consultas.filter(c => c.mueble != null);
   const consultasGenerales = consultas.filter(c => c.mueble == null);
   const consultasVisibles = vistaActual === VistaActual.CON_MUEBLE ? consultasConMueble : consultasGenerales;

  return (
    <>
      <div className="mdz-page-header">
        <div className="mdz-container">
          <p className="mdz-eyebrow">Administración</p>
          <h1>Consultas de clientes.</h1>
          <p className="mdz-section-copy">Gestioná las consultas sobre muebles del catálogo y las consultas generales de contacto.</p>
        </div>
      </div>

      <div className="mdz-container mdz-section">
        <div className="mdz-toolbar">
          <div className="mdz-tabs">
            <button
              className={`mdz-btn mdz-btn-filter ${vistaActual === VistaActual.CON_MUEBLE ? 'is-active' : ''}`}
              onClick={() => setVistaActual(VistaActual.CON_MUEBLE)}
            >
              <i className="fas fa-couch"></i> Consultas de muebles
            </button>
            <button
              className={`mdz-btn mdz-btn-filter ${vistaActual === VistaActual.GENERALES ? 'is-active' : ''}`}
              onClick={() => setVistaActual(VistaActual.GENERALES)}
            >
              <i className="fas fa-comments"></i> Consultas generales
            </button>
          </div>
          <span className="mdz-section-copy" style={{ fontSize: 13 }}>
            Página {currentPage} de {totalPages || 1} · {totalElements} consultas
          </span>
        </div>

        <div className="mdz-search" style={{ marginBottom: 28 }}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar por nombre de cliente..."
            value={busquedaNombre}
            onChange={handleSearchChange}
          />
          {isSearching && <i className="fas fa-spinner fa-spin"></i>}
        </div>

        {isLoading ? (
          <div className="mdz-loading-state"><Loader /></div>
        ) : consultasVisibles.length === 0 ? (
          <div className="mdz-empty-table">
            <i className="fas fa-inbox"></i>
            <h3>No hay consultas disponibles</h3>
            <p>Las consultas aparecerán acá cuando los clientes las envíen.</p>
          </div>
        ) : (
          <div className="mdz-table-wrap">
            <table className="mdz-table">
              <thead>
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
                {consultasVisibles.map((consulta) => (
                  <tr key={consulta.id}>
                    <td>#{consulta.id}</td>
                    <td><strong>{consulta.cliente?.nombreCliente} {consulta.cliente?.apellidoCliente}</strong></td>
                    <td>
                      <div>{consulta.cliente?.mailCliente}</div>
                      <div style={{ color: 'var(--mdz-muted-foreground)', fontSize: 12 }}>{consulta.cliente?.telefonoCliente || 'N/A'}</div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {consulta.fechaHoraAltaConsulta ? new Date(consulta.fechaHoraAltaConsulta).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div
                        title={consulta.mensajeConsulta || ''}
                        style={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {consulta.mensajeConsulta}
                      </div>
                    </td>
                    {vistaActual === VistaActual.CON_MUEBLE && (
                      <td>{consulta.mueble?.nombreMueble || 'Sin mueble'}</td>
                    )}
                    <td>
                      {consulta.respuesta ? (
                        <span className="mdz-pill mdz-pill-success"><i className="fas fa-check"></i> Respondida</span>
                      ) : (
                        <span className="mdz-pill mdz-pill-warning"><i className="fas fa-hourglass-half"></i> Pendiente</span>
                      )}
                    </td>
                    <td>
                      <div className="mdz-row-actions">
                        {consulta.mueble && (
                          <button
                            className="mdz-icon-btn"
                            title="Ver mueble consultado"
                            onClick={() => setConsultaParaVerMueble(consulta)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        )}
                        <button
                          className="mdz-icon-btn"
                          title={consulta.respuesta ? 'Ver / reenviar respuesta' : 'Responder consulta'}
                          onClick={() => setConsultaParaResponder(consulta)}
                          style={consulta.respuesta ? undefined : { borderColor: 'var(--mdz-primary)', color: 'var(--mdz-primary)' }}
                        >
                          <i className="fas fa-reply"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && consultasVisibles.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

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
    </>
  );
}

export default AdministrarSolicitud
