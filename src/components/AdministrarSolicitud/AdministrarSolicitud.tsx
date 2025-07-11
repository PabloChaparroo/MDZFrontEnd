import { useEffect, useState } from "react"
import { SolicitarVisitaService } from "../../services/SolicitarVisitaService"
import { SolicitarVisita } from "../../types/SolicitarVisita"
import { Table } from "react-bootstrap";
import Pagination from "../Pagination/Pagination";
import "./AdministrarSolicitud.css";

// Enum para los diferentes tipos de vista
enum VistaActual {
  SOLICITUDES = 'SOLICITUDES',
  CONSULTAS = 'CONSULTAS'
}

const AdministrarSolicitud = () => {

    const [solicitarVisita, setSolicitarVisita] = useState<SolicitarVisita[]>([]);
    const [vistaActual, setVistaActual] = useState<VistaActual>(VistaActual.SOLICITUDES);
    
    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [updatingStates, setUpdatingStates] = useState<Set<number>>(new Set());

   useEffect(() =>{
    if (vistaActual === VistaActual.SOLICITUDES) {
      fetchSolicitudes();
    } else if (vistaActual === VistaActual.CONSULTAS) {
      fetchConsultas();
    }
   },[vistaActual, currentPage]);

   const fetchSolicitudes = async () => {
    try {
      setIsLoading(true);
      const response = await SolicitarVisitaService.obtenerSolicitudesConMueblePaginadas(currentPage - 1);
      setSolicitarVisita(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error al obtener solicitudes con mueble:', error);
      setSolicitarVisita([]);
    } finally {
      setIsLoading(false);
    }
   };

   const fetchConsultas = async () => {
    try {
      setIsLoading(true);
      const response = await SolicitarVisitaService.obtenerConsultasPaginadas(currentPage - 1);
      setSolicitarVisita(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error al obtener consultas:', error);
      setSolicitarVisita([]);
    } finally {
      setIsLoading(false);
    }
   };

   const handleClickVista = (vista: VistaActual) => {
    setVistaActual(vista);
    setCurrentPage(1); // Resetear a la primera página al cambiar vista
   };

   const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const handleCambiarEstado = async (consultaId: number, nuevoEstado: string) => {
    try {
      console.log('🔄 [COMPONENTE] Iniciando cambio de estado:', { consultaId, nuevoEstado });
      
      // Agregar ID a la lista de consultas en actualización
      setUpdatingStates(prev => new Set([...prev, consultaId]));
      
      // Llamar al servicio para cambiar el estado
      await SolicitarVisitaService.cambiarEstadoSolicitud(consultaId, nuevoEstado);
      
      // Actualizar la consulta localmente - CORREGIDO: actualizar estadoCliente en lugar de estado
      setSolicitarVisita(prev => 
        prev.map(consulta => 
          consulta.id === consultaId 
            ? { 
                ...consulta, 
                estado: nuevoEstado, // Mantener para compatibilidad
                cliente: consulta.cliente ? {
                  ...consulta.cliente,
                  estadoCliente: nuevoEstado // Actualizar el estado real del cliente
                } : consulta.cliente
              }
            : consulta
        )
      );
      
      console.log('✅ [COMPONENTE] Estado actualizado exitosamente para ID:', consultaId);
      
    } catch (error) {
      console.error('❌ [COMPONENTE] Error al cambiar estado:', error);
      // Aquí podrías mostrar una notificación de error
      alert(`Error al cambiar el estado de la consulta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      // Remover ID de la lista de consultas en actualización
      setUpdatingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(consultaId);
        return newSet;
      });
    }
   };

   const getEstadoBadge = (consulta: SolicitarVisita) => {
    // Priorizar estadoCliente del cliente, luego estado de la solicitud
    const estado = consulta.cliente?.estadoCliente || consulta.estado;
    
    console.log('🔍 [DEBUG-ESTADO] Obteniendo badge para:', { 
      consultaId: consulta.id, 
      estadoCliente: consulta.cliente?.estadoCliente,
      estadoSolicitud: consulta.estado,
      estadoFinal: estado 
    });
    
    switch (estado?.toLowerCase()) {
      case 'finalizado':
        return <span className="badge bg-success"><i className="fas fa-check me-1"></i>Finalizado</span>;
      case 'en_proceso':
        return <span className="badge bg-warning text-dark"><i className="fas fa-clock me-1"></i>En Proceso</span>;
      case 'pendiente':
      default:
        return <span className="badge bg-secondary"><i className="fas fa-hourglass-half me-1"></i>Pendiente</span>;
    }
   };

   // Eliminado renderPaginacion: ahora se usa el componente Pagination reutilizable

   const getTituloVista = () => {
    switch (vistaActual) {
      case VistaActual.SOLICITUDES:
        return 'Solicitudes de Visita';
      case VistaActual.CONSULTAS:
        return 'Consultas Generales';
      default:
        return 'Administrar Solicitudes';
    }
   };

  return (
    <div className="administrar-solicitud">
      {/* Hero Section */}      
         <div className="catalog-header fade-in-up">
              <h1 className="catalog-title">
                <i className="fas fa-cogs me-3"></i>
                Administración de Solicitudes y Consultas
              </h1>
               
              <p className="catalog-subtitle">
              Sistema de gestión integral para solicitudes de visita y consultas generales
            </p>
            <hr/>
            <div className="about-hero-divider"></div>
         </div>    

      {/* Botones de navegación */}
      <div className="btn-group fade-in" role="group" aria-label="Navegación">
        <button 
          className={`category-text ${vistaActual === VistaActual.SOLICITUDES ? 'bg-warning text-dark' : 'bg-black'}`}
          onClick={() => handleClickVista(VistaActual.SOLICITUDES)}
        >
          <i className="fas fa-calendar-check me-2"></i>
          Solicitudes de Visita
        </button>
        <button 
          className={`category-text ${vistaActual === VistaActual.CONSULTAS ? 'bg-warning text-dark' : 'bg-black'}`}
          onClick={() => handleClickVista(VistaActual.CONSULTAS)}
        >
          <i className="fas fa-comments me-2"></i>
          Consultas Generales
        </button>
      </div>

      {/* Título de la vista actual */}
      <div className="section-header fade-in">
        <h2 className="section-title">
          <i className={`fas ${
            vistaActual === VistaActual.SOLICITUDES ? 'fa-calendar-check' : 'fa-comments'
          }`}></i>
          {getTituloVista()}
        </h2>
        {vistaActual === VistaActual.CONSULTAS && (
          <div className="section-meta">
            Página {currentPage} de {totalPages} | Total: {totalElements} consultas
          </div>
        )}
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

      {/* Tabla principal */}
      {!isLoading && (
        <div className="table-container fade-in">
          {vistaActual === VistaActual.SOLICITUDES && (
            <>
              <div className="table-responsive">
                <Table hover className="professional-table">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Contacto</th>
                      <th>Fecha</th>
                      <th>Consulta</th>
                      <th>Mueble</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitarVisita.map((solicitud) => (
                      <tr key={solicitud.id} className="slide-in">
                        <td>
                          <span className="badge bg-success">#{solicitud.id}</span>
                        </td>
                        <td>
                          <div className="client-info">
                            <strong>{solicitud.cliente?.nombreCliente} {solicitud.cliente?.apellidoCliente}</strong>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info">
                            <div><i className="fas fa-envelope me-1"></i> {solicitud.cliente?.mailCliente}</div>
                            <div><i className="fas fa-phone me-1"></i> {solicitud.cliente?.telefonoCliente || 'N/A'}</div>
                          </div>
                        </td>
                        <td>
                          <div className="date-info">
                            {solicitud.cliente?.fechaHoraAltaCliente ? 
                              new Date(solicitud.cliente.fechaHoraAltaCliente).toLocaleDateString() : 
                              'N/A'
                            }
                          </div>
                        </td>
                        <td>
                          <div className="consultation-text">
                            {solicitud.consultaSolicitarVisita}
                          </div>
                        </td>
                        <td>
                          <div className="product-info">
                            <strong>{solicitud.mueble?.nombreMueble || 'Sin mueble'}</strong>
                          </div>
                        </td>
                        <td>
                          <div className="price-info">
                            {solicitud.mueble?.precio ? (
                              <span className="price-display">$ {solicitud.mueble.precio}</span>
                            ) : (
                              <span className="text-muted">Sin precio</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {/* Paginación para solicitudes de visita */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}

          {vistaActual === VistaActual.CONSULTAS && (
            <>
              <div className="table-responsive">
                <Table hover className="professional-table">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Contacto</th>
                      <th>Fecha</th>
                      <th>Consulta</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitarVisita.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-5">
                          <div className="empty-state">
                            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">No hay consultas disponibles</h5>
                            <p className="text-muted">Las consultas aparecerán aquí cuando los clientes las envíen</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      solicitarVisita.map((consulta) => (
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
                              {consulta.fechaHoraAltaSolicitarVisita ? 
                                new Date(consulta.fechaHoraAltaSolicitarVisita).toLocaleDateString() : 
                                'N/A'
                              }
                            </div>
                          </td>
                          <td>
                            <div
                              className="consultation-text"
                              title={consulta.consultaSolicitarVisita || ''}
                              style={{
                                maxWidth: '180px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: consulta.consultaSolicitarVisita ? 'pointer' : 'default',
                              }}
                            >
                              {consulta.consultaSolicitarVisita && consulta.consultaSolicitarVisita.length > 40
                                ? consulta.consultaSolicitarVisita.slice(0, 40) + '...'
                                : consulta.consultaSolicitarVisita}
                            </div>
                          </td>
                          <td>
                            {getEstadoBadge(consulta)}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {/* Usar el estado real del cliente para las condiciones */}
                              {(consulta.cliente?.estadoCliente || consulta.estado)?.toLowerCase() !== 'finalizado' && (
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleCambiarEstado(consulta.id, 'FINALIZADO')}
                                  disabled={updatingStates.has(consulta.id)}
                                  title="Marcar como finalizado"
                                >
                                  {updatingStates.has(consulta.id) ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                  ) : (
                                    <i className="fas fa-check"></i>
                                  )}
                                </button>
                              )}
                              {(consulta.cliente?.estadoCliente || consulta.estado)?.toLowerCase() === 'finalizado' && (
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => handleCambiarEstado(consulta.id, 'PENDIENTE')}
                                  disabled={updatingStates.has(consulta.id)}
                                  title="Marcar como pendiente"
                                >
                                  {updatingStates.has(consulta.id) ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                  ) : (
                                    <i className="fas fa-undo"></i>
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
              {/* Paginación para consultas generales */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AdministrarSolicitud
