import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table } from 'react-bootstrap';

// Types
import { Mueble } from '../../types/Mueble';
import { Categoria } from '../../types/Categoria';
import { ModalType } from '../../types/ModalType';
// import { MuebleService } from '../../services/MuebleService';

// Services
import { MuebleService } from '../../services/MuebleService';
import { CategoriaService } from '../../services/CategoriaService';

// Components
import Loader from '../Loader/Loader';
import CatalogoModalMueble from '../ModalCatalogoMuebles/CatalogoModalMueble';
import ModalABMCategoria from '../CategoriaModal/CategoriaModal';
import ModalGestionImagenes from '../ModalGestionImagenes/ModalGestionImagenes';

// Styles

import '../CatalogoMueble/CatalogoMueble.css';
import './AbmCategoriaTabla.css';
import Pagination from '../Pagination/Pagination';

const CatalogoTabla = () => {
  const location = useLocation();

  // Estados principales
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  // Estados de modales
  const [showModal, setShowModal] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showGestionImagenes, setShowGestionImagenes] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);

  // Estados de categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasParaEdicion, setCategoriasParaEdicion] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [categoria, setCategoria] = useState<Categoria>(() => initializeNewCategoria());
  const [editCategory, setEditCategory] = useState(false);
  const [mostrarCategoriasDadasDeBaja, setMostrarCategoriasDadasDeBaja] = useState(false);

  // Estados de muebles
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [mueblesFiltrados, setMueblesFiltrados] = useState<Mueble[]>([]);
  const [mueble, setMueble] = useState<Mueble>(() => initializeNewMueble());
  const [muebleParaImagenes, setMuebleParaImagenes] = useState<Mueble>(() => initializeNewMueble());
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMuebles, setIsLoadingMuebles] = useState(false);
  const [mostrarMueblesDadosDeBaja, setMostrarMueblesDadosDeBaja] = useState(false);
  // const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  // Eliminado: const [, setTotalPages] = useState(0); y setTotalElements

  // Funciones de inicialización
  function initializeNewCategoria(): Categoria {
    return {
      id: 0,
      nombreCategoria: '',
      fechaAltaCategoria: '',
      fechaModificacionCategoria: '',
      fechaBajaCategoria: null
    };
  }

  function initializeNewMueble(): Mueble {
    return {
      id: 0,
      nombreMueble: '',
      fechaAltaMueble: null,
      fechaModificacionMueble: null,
      fechaBajaMueble: null,
      colorMueble: '',
      dimension: null,
      tipoMadera: '',
      precio: null,
      descripcion: '',
      imagenes: [],
      categoria: null,
      imagenPortada: null,
    };
  }

  // Efecto para scroll al inicio cuando cambia la ubicación
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Efecto para cargar categorías (siempre todas para los botones principales)
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoading(true);
        // Siempre cargar todas las categorías para los botones principales
        const categoriasData = await CategoriaService.getAllCategoria();
        setCategorias(categoriasData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setIsLoading(false);
      }
    };
    fetchCategorias();
  }, [refreshData]);

  // Efecto para cargar categorías para la tabla de edición (con filtro)
  useEffect(() => {
    const fetchCategoriasParaEdicion = async () => {
      if (!editCategory) return; // Solo cargar cuando estamos en modo edición
      
      try {
        let categoriasData: Categoria[] = [];
        
        if (mostrarCategoriasDadasDeBaja) {
          // Cargar categorías dadas de baja
          categoriasData = await CategoriaService.getCategoriasDadasDeBaja();
        } else {
          // Cargar todas las categorías
          categoriasData = await CategoriaService.getAllCategoria();
        }
        
        setCategoriasParaEdicion(categoriasData);
      } catch (error) {
        console.error('Error al cargar categorías para edición:', error);
        // En caso de error, mostrar array vacío para evitar errores en la UI
        setCategoriasParaEdicion([]);
      }
    };
    fetchCategoriasParaEdicion();
  }, [refreshData, mostrarCategoriasDadasDeBaja, editCategory]);

  // Efecto para cargar muebles (activos o dados de baja) de forma paginada o por categoría
  useEffect(() => {
    const fetchMuebles = async () => {
      try {
        setIsLoadingMuebles(true);
        if (mostrarMueblesDadosDeBaja) {
          // Cargar muebles dados de baja usando el método correcto
          const response = await MuebleService.getMueblesDadosDeBaja(currentPage);
          setMuebles(response.muebles || []);
          setTotalPages(response.totalPages);
        } else if (categoriaSeleccionada) {
          // Buscar la categoría seleccionada para obtener su ID
          const catObj = categorias.find(cat => cat.nombreCategoria === categoriaSeleccionada);
          if (catObj) {
            const response = await MuebleService.getCatalogoMueblesByCategoria(currentPage, catObj.id);
            setMuebles(response.content);
            setTotalPages(response.totalPages);
          } else {
            setMuebles([]);
            setTotalPages(0);
          }
        } else {
          // Cargar muebles activos (sin filtro de categoría)
          const mueblesData = await MuebleService.getMueblesByPage(currentPage);
          setMuebles(mueblesData);
          setTotalPages(0);
        }
      } catch (error) {
        console.error('Error al cargar muebles:', error);
        setMuebles([]);
        setTotalPages(0);
      } finally {
        setIsLoadingMuebles(false);
      }
    };
    fetchMuebles();
  }, [refreshData, currentPage, mostrarMueblesDadosDeBaja, categoriaSeleccionada, categorias]);


  // Estado y lógica para el filtro de búsqueda por nombre de mueble
  const [busquedaMueble, setBusquedaMueble] = useState("");
  const [localPage, setLocalPage] = useState(0); // Para paginación local

  // Efecto para filtrar muebles por nombre (buscador) y paginar localmente si hay búsqueda
  useEffect(() => {
    if (busquedaMueble.trim() !== "") {
      let filtrados = Array.isArray(muebles) ? muebles : [];
      filtrados = filtrados.filter(mueble =>
        mueble.nombreMueble.toLowerCase().includes(busquedaMueble.trim().toLowerCase())
      );
      setMueblesFiltrados(filtrados);
    } else {
      setMueblesFiltrados(muebles);
    }
  }, [muebles, busquedaMueble]);

  // Resetear página local/backend al cambiar búsqueda
  useEffect(() => {
    setLocalPage(0);
    setCurrentPage(0);
  }, [busquedaMueble, categoriaSeleccionada]);

  // Efecto para corregir currentPage/localPage si se queda fuera de rango al cambiar filtros
  useEffect(() => {
    if (busquedaMueble.trim() !== "") {
      // Paginación local
      const pages = Math.ceil(mueblesFiltrados.length / pageSize);
      if (localPage >= pages && pages > 0) {
        setLocalPage(pages - 1);
      }
    } else {
      // Paginación backend
      if (currentPage >= totalPages && totalPages > 0) {
        setCurrentPage(totalPages - 1);
      }
    }
  }, [mueblesFiltrados, busquedaMueble, localPage, currentPage, totalPages, pageSize]);

  // Manejadores de eventos para categorías
  const handleClickCategoria = (categoria: string) => {
    setCategoriaSeleccionada(categoria);
    setEditCategory(false);
    setCurrentPage(0); // Reiniciar la página cuando se selecciona una categoría
    setMostrarMueblesDadosDeBaja(false); // Resetear filtro de muebles dados de baja
  };

  const handleClickEditCategory = () => {
    setEditCategory(true);
    setCategoriaSeleccionada("");
    setCurrentPage(0); // Reiniciar la página cuando se entra en modo edición
    setMostrarMueblesDadosDeBaja(false); // Resetear filtro de muebles dados de baja
  };

  const handleClickCategoriaButton = (_newNombreCategoria: string, cat: Categoria, modal: ModalType) => {
    setModalType(modal);
    setCategoria(cat);
    setShowEditCategory(true);
  };

  // Manejador para el checkbox de categorías dadas de baja
  const handleToggleCategoriasDadasDeBaja = () => {
    setMostrarCategoriasDadasDeBaja(!mostrarCategoriasDadasDeBaja);
    setCategoriaSeleccionada(""); // Limpiar la selección actual
  };

  // Manejadores de eventos para muebles
  const handleClickMueble = (_newNombreMueble: string, mue: Mueble, modal: ModalType) => {
    setModalType(modal);
    setMueble(mue);
    setShowModal(true);
  };

  // Manejador para abrir el modal de gestión de imágenes
  const handleClickImagenPortada = (mueble: Mueble) => {
    setMuebleParaImagenes(mueble);
    setShowGestionImagenes(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    // No hacer refresh aquí - el modal ya lo hace cuando es exitoso
  };

  // Manejador para cerrar el modal de gestión de imágenes
  const handleGestionImagenesClose = () => {
    setShowGestionImagenes(false);
  };

  // Manejador para cuando se actualizan las imágenes
  const handleImagenesActualizadas = () => {
    // Activar refresh para recargar los muebles con las imágenes actualizadas
    setRefreshData(prev => !prev);
  };

  const handleCategoryModalClose = async () => {
    setShowEditCategory(false);
    // Simplificar - solo activar el refresh, no hacer múltiples llamadas
    setRefreshData(prev => !prev);
  };

  // Función para manejar el refresh desde el modal de categoría (optimizada)
  const handleCategoryRefresh = async () => {
    setRefreshData(prev => !prev);
    
    // Recargar categorías de manera optimizada
    try {
      const categoriasData = await CategoriaService.getAllCategoria();
      setCategorias(categoriasData);
      
      // Solo recargar categorías para edición si estamos en modo edición
      if (editCategory) {
        let categoriasParaEdicionData: Categoria[] = [];
        
        if (mostrarCategoriasDadasDeBaja) {
          categoriasParaEdicionData = await CategoriaService.getCategoriasDadasDeBaja();
        } else {
          categoriasParaEdicionData = categoriasData; // Reutilizar las ya cargadas
        }
        
        setCategoriasParaEdicion(categoriasParaEdicionData);
      }
      
    } catch (error) {
      console.error('Error al recargar categorías:', error);
      // En caso de error, al menos mantener las categorías principales
      if (editCategory) {
        setCategoriasParaEdicion([]);
      }
    }
  };

  // Manejador para cambio de página
  const handlePageChange = (newPage: number) => {
    if (busquedaMueble.trim() !== "") {
      setLocalPage(newPage);
    } else {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="abm-container">
      {/* Overlay para oscurecer el fondo cuando hay modales abiertos */}
      {(showModal || showEditCategory || showGestionImagenes) && (
        <div className="modal-overlay show"></div>
      )}

      {/* Hero Section */}
        <div className="catalog-header fade-in-up">
              <h1 className="catalog-title">
                <i className="fas fa-cogs me-3"></i>
                Gestión de Categorías y Mueble
              </h1>
               <p className="catalog-subtitle">
              Sistema de gestión de categorías y muebles
            </p>
            <hr/>
            <div className="about-hero-divider"></div>
         </div>

      {/* Botones de categorías */}
      <div className="category-buttons-container fade-in">
        {categorias.map((categoria) => (
          <button 
            key={categoria.id}
            className={`category-btn ${categoriaSeleccionada === categoria.nombreCategoria ? 'active' : ''}`}
            onClick={() => handleClickCategoria(categoria.nombreCategoria)}
          >
            <i className="fas fa-tag me-2"></i>
            {categoria.nombreCategoria}
          </button>
        ))}
        
        <button 
          className="category-btn edit-btn"
          onClick={handleClickEditCategory}
        >
          <i className="fas fa-edit me-2"></i>
          Editar Categorías
        </button>
      </div>

      {/* Sección de edición de categorías */}
      {editCategory && (
        <div className="fade-in">
          <div className="section-header">
            <div className="d-flex align-items-center justify-content-center">
              <i className="fas fa-tags icon"></i>
              <h3>Administración de Categorías</h3>
            </div>
          </div>

          {/* Checkbox para filtrar categorías dadas de baja - Solo en modo edición */}
          <div className="filter-section">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="mostrarCategoriasDadasDeBaja"
                checked={mostrarCategoriasDadasDeBaja}
                onChange={handleToggleCategoriasDadasDeBaja}
              />
              <label className="form-check-label" htmlFor="mostrarCategoriasDadasDeBaja">
                <i className="fas fa-eye-slash me-2"></i>
                Mostrar solo categorías dadas de baja
              </label>
            </div>
          </div>

          <div className="category-buttons-container">
            <button 
              className="category-btn new-btn"
              onClick={() => handleClickCategoriaButton(
                "Nueva Categoría", 
                initializeNewCategoria(), 
                ModalType.CREATE
              )}
            >
              <i className="fas fa-plus me-2"></i>
              Nueva Categoría
            </button>
          </div>
          
          <div className="table-container">
            <div className="table-responsive">
              {categoriasParaEdicion.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-info-circle fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">
                    {mostrarCategoriasDadasDeBaja 
                      ? "No hay categorías dadas de baja" 
                      : "No hay categorías disponibles"}
                  </h5>
                  <p className="text-muted">
                    {mostrarCategoriasDadasDeBaja 
                      ? "Todas las categorías están activas actualmente." 
                      : "Crea una nueva categoría para comenzar."}
                  </p>
                </div>
              ) : (
                <Table className="professional-table">
                  <thead>
                    <tr>
                      <th>ID Categoría</th>
                      <th>Nombre de la Categoría</th>
                      <th>Fecha de Creación</th>
                      <th>Última Modificación</th>
                      <th>Fecha de Baja</th>
                      <th>Estado Actual</th>
                      <th>Acciones Disponibles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriasParaEdicion.map((categoria, idx) => (
                      <tr key={categoria.id ? categoria.id : `new-${idx}`} className="slide-in">
                        <td>
                          <span className="status-badge active">#{categoria.id}</span>
                        </td>
                        <td>
                          <strong>{categoria.nombreCategoria}</strong>
                        </td>
                        <td>
                          {categoria.fechaAltaCategoria ? 
                            new Date(categoria.fechaAltaCategoria).toLocaleDateString() : 
                            'N/A'
                          }
                        </td>
                        <td>
                          {categoria.fechaModificacionCategoria ? 
                            new Date(categoria.fechaModificacionCategoria).toLocaleDateString() : 
                            'N/A'
                          }
                        </td>
                        <td>
                          {categoria.fechaBajaCategoria ? 
                            new Date(categoria.fechaBajaCategoria).toLocaleDateString() : 
                            <span className="text-muted">-</span>
                          }
                        </td>
                        <td>
                          <span className={`status-badge ${categoria.fechaBajaCategoria ? 'inactive' : 'active'}`}>
                            {categoria.fechaBajaCategoria ? 'Inactiva' : 'Activa'}
                          </span>
                        </td>
                        <td>
                          {!categoria.fechaBajaCategoria && (
                            <button 
                              className="action-btn edit-btn"
                              onClick={() => handleClickCategoriaButton(
                                "Editar categoría", 
                                categoria, 
                                ModalType.UPDATE
                              )}
                            >
                              <i className="fas fa-edit me-1"></i>
                              Editar
                            </button>
                          )}
                          
                          {!categoria.fechaBajaCategoria && (
                            <button 
                              className="action-btn warning-btn"
                              onClick={() => handleClickCategoriaButton(
                                "Dar de baja categoría", 
                                categoria, 
                                ModalType.BAJA_LOGICA
                              )}
                            >
                              <i className="fas fa-ban me-1"></i>
                              Dar de Baja
                            </button>
                          )}
                          
                          {categoria.fechaBajaCategoria && (
                            <span className="text-muted font-italic">
                              <i className="fas fa-lock me-1"></i>
                              No editable
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sección de todos los muebles (con filtros) */}
      {/* Ahora solo se muestra si hay una categoría seleccionada y no está en modo edición */}
      {/* Si quieres que no se muestre nunca hasta seleccionar categoría, simplemente no renderices nada aquí */}
      {/* Si quieres mostrar un mensaje, puedes agregarlo aquí */}
      {!categoriaSeleccionada && !editCategory && (
        <></>
      )}

      {/* Sección de muebles filtrados por categoría */}
      {categoriaSeleccionada && (
        <div className="fade-in">
          <div className="section-header">
            <div className="d-flex align-items-center justify-content-center">
              <i className="fas fa-couch icon"></i>
              <h3>
                Muebles de la categoría: 
                <span className="subtitle">{categoriaSeleccionada}</span>
              </h3>
            </div>
          </div>

          {/* Filtro para muebles dados de baja */}
          <div className="filter-section" style={{ maxWidth: 350, marginBottom: 10, textAlign: 'left' }}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="mostrarMueblesDadosDeBaja"
                checked={mostrarMueblesDadosDeBaja}
                onChange={() => setMostrarMueblesDadosDeBaja(v => !v)}
              />
              <label className="form-check-label" htmlFor="mostrarMueblesDadosDeBaja">
                <i className="fas fa-eye-slash me-2"></i>
                Mostrar solo muebles dados de baja
              </label>
            </div>
          </div>


          {/* Botón Nuevo mueble y Buscador en la misma fila */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16 }}>
            <div>
              <button 
                className="category-btn new-btn"
                onClick={() => handleClickMueble(
                  "Nuevo mueble", 
                  initializeNewMueble(), 
                  ModalType.CREATE
                )}
              >
                <i className="fas fa-plus me-2"></i>
                Nuevo Mueble
              </button>
            </div>
            <div style={{ maxWidth: 350, width: '100%' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar mueble por nombre..."
                value={busquedaMueble}
                onChange={e => setBusquedaMueble(e.target.value)}
                style={{ borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
              />
            </div>
          </div>

          <div className="table-container">
            {isLoadingMuebles ? (
              <div className="text-center py-5">
                <i className="fas fa-spinner fa-spin fa-3x text-primary mb-3"></i>
                <h5 className="text-muted">Cargando muebles...</h5>
                <p className="text-muted">Por favor espera un momento</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="professional-table">
                <thead>
                  <tr>
                    <th>ID Mueble</th>
                    <th>Nombre del Mueble</th>
                    <th>Categoría</th>
                    <th>Detalles del Producto</th>
                    <th>Precio (ARS)</th>
                    <th>Descripción</th>
                    <th>Imagen Principal</th>
                    <th>Acciones Disponibles</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(mueblesFiltrados) ?
                    (busquedaMueble.trim() !== ""
                      ? mueblesFiltrados.slice(localPage * pageSize, (localPage + 1) * pageSize)
                      : mueblesFiltrados)
                    : []).map((mueble) => (
                    <tr key={mueble.id} className="slide-in">
                      <td>
                        <span className="status-badge active">#{mueble.id}</span>
                      </td>
                      <td>
                        <strong>{mueble.nombreMueble}</strong>
                      </td>
                      <td>
                        <div className="category-info">
                          <span className="category-name">{mueble.categoria?.nombreCategoria || 'Sin categoría'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="product-details-compact">
                          <div className="detail-row">
                            <i className="fas fa-palette me-1"></i>
                            <span>{mueble.colorMueble}</span>
                          </div>
                          <div className="detail-row">
                            <i className="fas fa-ruler me-1"></i>
                            <span>{mueble.dimension || 'N/A'}</span>
                          </div>
                          <div className="detail-row">
                            <i className="fas fa-tree me-1"></i>
                            <span>{mueble.tipoMadera}</span>
                          </div>
                          <div className="detail-row">
                            <i className="fas fa-calendar-plus me-1"></i>
                            <span>{mueble.fechaAltaMueble ? new Date(mueble.fechaAltaMueble).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="price-compact">
                          {mueble.precio ? (
                            <span className="price-display">${mueble.precio.toLocaleString()}</span>
                          ) : (
                            <span className="price-na">Sin precio</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="description-compact">
                          {mueble.descripcion}
                        </div>
                      </td>
                      <td>
                        <div className="imagen-portada-container">
                          {(mueble.imagenes || [])
                            .filter(imagen => imagen.esPortada)
                            .map((imagen, index) => (
                              <img 
                                key={index}
                                className="image-preview clickable-image"
                                src={`data:image/png;base64,${imagen.imagenes}`}
                                alt={mueble.nombreMueble}
                                onClick={() => handleClickImagenPortada(mueble)}
                                title="Click para gestionar imágenes"
                              />
                            ))
                          }
                          {(mueble.imagenes || []).filter(imagen => imagen.esPortada).length === 0 && (
                            <div 
                              className="no-image-placeholder clickable-image"
                              onClick={() => handleClickImagenPortada(mueble)}
                              title="Click para agregar imágenes"
                            >
                              <i className="fas fa-plus-circle"></i>
                              <span>Agregar imagen</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleClickMueble(
                              "Editar producto", 
                              mueble, 
                              ModalType.UPDATE
                            )}
                          >
                            <i className="fas fa-edit me-1"></i>
                            Editar
                          </button>
                          <button 
                            className="action-btn warning-btn"
                            onClick={() => handleClickMueble(
                              "Dar de baja mueble", 
                              mueble, 
                              ModalType.BAJA_LOGICA
                            )}
                          >
                            <i className="fas fa-ban me-1"></i>
                            Dar de Baja
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              </div>
            )}
          </div>
          
          {/* Controles de paginación */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Pagination
              currentPage={busquedaMueble.trim() !== "" ? localPage + 1 : currentPage + 1}
              totalPages={busquedaMueble.trim() !== "" ? Math.max(1, Math.ceil(mueblesFiltrados.length / pageSize)) : (totalPages > 0 ? totalPages : 1)}
              onPageChange={page => handlePageChange(page - 1)}
              isLoading={isLoadingMuebles}
            />
          </div>
        </div>
      )}

      {/* Modal de categorías */}
      {showEditCategory && (
        <ModalABMCategoria
          show={showEditCategory}
          onHide={handleCategoryModalClose}
          modalType={modalType}
          cat={categoria}
          refreshData={handleCategoryRefresh}
        />
      )}

      {/* Modal de muebles */}
      {showModal && (
        <CatalogoModalMueble
          show={showModal}
          onHide={handleModalClose}
          modalType={modalType}
          mue={mueble}
          refreshData={setRefreshData}
          categoria={categoriaSeleccionada}
          categorias={categorias}
        />
      )}

      {/* Modal de gestión de imágenes */}
      {showGestionImagenes && (
        <ModalGestionImagenes
          show={showGestionImagenes}
          onHide={handleGestionImagenesClose}
          mueble={muebleParaImagenes}
          onImagenesActualizadas={handleImagenesActualizadas}
        />
      )}
    </div>
  );
};

export default CatalogoTabla;
