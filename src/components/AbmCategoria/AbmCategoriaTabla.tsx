import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table } from 'react-bootstrap';

// Types
import { Mueble } from '../../types/Mueble';
import { Categoria } from '../../types/Categoria';
import { ModalType } from '../../types/ModalType';

// Services
import { MuebleService } from '../../services/MuebleService';
import { CategoriaService } from '../../services/CategoriaService';

// Components
import Loader from '../Loader/Loader';
import CatalogoModalMueble from '../ModalCatalogoMuebles/CatalogoModalMueble';
import ModalABMCategoria from '../CategoriaModal/CategoriaModal';

// Styles
import '../CatalogoMueble/CatalogoMueble.css';
import './AbmCategoriaTabla.css';

const CatalogoTabla = () => {
  const location = useLocation();

  // Estados principales
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  // Estados de modales
  const [showModal, setShowModal] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);

  // Estados de categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [categoria, setCategoria] = useState<Categoria>(() => initializeNewCategoria());
  const [editCategory, setEditCategory] = useState(false);

  // Estados de muebles
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [mueblesFiltrados, setMueblesFiltrados] = useState<Mueble[]>([]);
  const [mueble, setMueble] = useState<Mueble>(() => initializeNewMueble());

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
      fechaAltaMueble: '',
      fechaModificacionMueble: '',
      fechaBajaMueble: '',
      colorMueble: '',
      dimension: '',
      tipoMadera: '',
      precio: 0,
      descripcion: '',
      imagenes: [],
      categoria: null,
    };
  }

  // Efecto para scroll al inicio cuando cambia la ubicación
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Efecto para cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoading(true);
        const categoriasData = await CategoriaService.getAllCategoria();
        setCategorias(categoriasData);
        console.log('Categorías cargadas:', categoriasData); // Para debug
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setIsLoading(false);
      }
    };
    fetchCategorias();
  }, [refreshData]);

  // Efecto para cargar muebles
  useEffect(() => {
    const fetchMuebles = async () => {
      try {
        const mueblesData = await MuebleService.getAllMuebles();
        setMuebles(mueblesData);
      } catch (error) {
        console.error('Error al cargar muebles:', error);
      }
    };
    fetchMuebles();
  }, [refreshData]);

  // Efecto para filtrar muebles por categoría
  useEffect(() => {
    if (categoriaSeleccionada) {
      const mueblesFiltrados = muebles.filter(
        mueble => mueble.categoria?.nombreCategoria === categoriaSeleccionada
      );
      setMueblesFiltrados(mueblesFiltrados);
    } else {
      setMueblesFiltrados([]);
    }
  }, [categoriaSeleccionada, muebles]);

  // Manejadores de eventos para categorías
  const handleClickCategoria = (categoria: string) => {
    setCategoriaSeleccionada(categoria);
    setEditCategory(false);
  };

  const handleClickEditCategory = () => {
    setEditCategory(true);
    setCategoriaSeleccionada("");
  };

  const handleClickCategoriaButton = (_newNombreCategoria: string, cat: Categoria, modal: ModalType) => {
    setModalType(modal);
    setCategoria(cat);
    setShowEditCategory(true);
  };

  // Manejadores de eventos para muebles
  const handleClickMueble = (_newNombreMueble: string, mue: Mueble, modal: ModalType) => {
    setModalType(modal);
    setMueble(mue);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setRefreshData(prev => !prev);
  };

  const handleCategoryModalClose = async () => {
    setShowEditCategory(false);
    
    // Forzar el refresh inmediatamente
    setRefreshData(prev => !prev);
    
    // Recargar categorías inmediatamente
    try {
      const categoriasData = await CategoriaService.getAllCategoria();
      setCategorias(categoriasData);
      console.log('Modal cerrado - Categorías actualizadas:', categoriasData); // Para debug
    } catch (error) {
      console.error('Error al recargar categorías al cerrar modal:', error);
    }
  };

  // Función para manejar el refresh desde el modal de categoría
  const handleCategoryRefresh = async () => {
    console.log('Refrescando categorías...'); // Para debug
    setRefreshData(prev => !prev);
    
    // Forzar recarga inmediata de categorías
    try {
      const categoriasData = await CategoriaService.getAllCategoria();
      setCategorias(categoriasData);
      console.log('Categorías actualizadas inmediatamente:', categoriasData); // Para debug
    } catch (error) {
      console.error('Error al recargar categorías:', error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="abm-container">
      {/* Overlay para oscurecer el fondo cuando hay modales abiertos */}
      {(showModal || showEditCategory) && (
        <div className="modal-overlay show"></div>
      )}

      {/* Título principal */}
      <div className="section-header fade-in">
        <div className="d-flex align-items-center justify-content-center">
          <i className="fas fa-cogs icon"></i>
          <h3>Gestión de Categorías y Muebles</h3>
        </div>
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
              <Table className="professional-table">
                <thead>
                  <tr>
                    <th>ID Categoría</th>
                    <th>Nombre de la Categoría</th>
                    <th>Fecha de Creación</th>
                    <th>Última Modificación</th>
                    <th>Estado Actual</th>
                    <th>Acciones Disponibles</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((categoria) => (
                    <tr key={categoria.id} className="slide-in">
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
                        <span className={`status-badge ${categoria.fechaBajaCategoria ? 'inactive' : 'active'}`}>
                          {categoria.fechaBajaCategoria ? 'Inactiva' : 'Activa'}
                        </span>
                      </td>
                      <td>
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
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleClickCategoriaButton(
                            "Borrar categoría", 
                            categoria, 
                            ModalType.DELETE
                          )}
                        >
                          <i className="fas fa-trash me-1"></i>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* Sección de muebles filtrados */}
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

          <div className="category-buttons-container">
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

          <div className="table-container">
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
                  {mueblesFiltrados.map((mueble) => (
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
                        <div className="product-details">
                          <div className="detail-item">
                            <i className="fas fa-palette me-1"></i>
                            <span><strong>Color:</strong> {mueble.colorMueble}</span>
                          </div>
                          <div className="detail-item">
                            <i className="fas fa-ruler me-1"></i>
                            <span><strong>Dimensiones:</strong> {mueble.dimension}</span>
                          </div>
                          <div className="detail-item">
                            <i className="fas fa-tree me-1"></i>
                            <span><strong>Madera:</strong> {mueble.tipoMadera}</span>
                          </div>
                          <div className="detail-item">
                            <i className="fas fa-calendar-plus me-1"></i>
                            <span><strong>Creado:</strong> {mueble.fechaAltaMueble ? new Date(mueble.fechaAltaMueble).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="price-display">${mueble.precio}</span>
                      </td>
                      <td>
                        <div className="description-cell">
                          {mueble.descripcion}
                        </div>
                      </td>
                      <td>
                        {mueble.imagenes
                          .filter(imagen => imagen.esPortada)
                          .map((imagen, index) => (
                            <img 
                              key={index}
                              className="image-preview"
                              src={`data:image/png;base64,${imagen.imagenes}`}
                              alt={mueble.nombreMueble}
                            />
                          ))
                        }
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
                            className="action-btn disable-btn"
                            onClick={() => handleClickMueble(
                              "Inhabilitar mueble", 
                              mueble, 
                              ModalType.UPDATE
                            )}
                          >
                            <i className="fas fa-ban me-1"></i>
                            Inhabilitar
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleClickMueble(
                              "Eliminar producto", 
                              mueble, 
                              ModalType.DELETE
                            )}
                          >
                            <i className="fas fa-trash me-1"></i>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
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
    </div>
  );
};

export default CatalogoTabla;
