import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Types
import { Categoria } from '../../types/Categoria';
import { Mueble } from '../../types/Mueble';

// Services
import { CategoriaService } from '../../services/CategoriaService';
import { MuebleService } from '../../services/MuebleService';

// Components
import Loader from '../Loader/Loader';
import Pagination from '../Pagination/Pagination';

// Styles
import './CatalogoMueble.css';




const CatalogoMueble = () => {
  const location = useLocation();

  // Estados principales
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados de categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  // Estados de muebles
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  // Estados de búsqueda
  const [filtroTexto, setFiltroTexto] = useState('');
  const [esBusqueda, setEsBusqueda] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  // Función de búsqueda en tiempo real con debounce
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setEsBusqueda(false);
      setCurrentPage(1);
      return;
    }

    try {
      setIsSearching(true);
      setEsBusqueda(true);
      setCurrentPage(1);
      
      console.log('🔍 Búsqueda en tiempo real:', searchTerm.trim());
      const response = await MuebleService.filtrarPorNombreOColor(searchTerm.trim(), 0);
      setMuebles(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error en búsqueda en tiempo real:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Efecto para scroll al inicio cuando cambia la ubicación
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Efecto para limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Efecto para cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasData = await CategoriaService.getAllCategoria();
        setCategorias(categoriasData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setIsLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  // Efecto para cargar muebles según la categoría seleccionada (solo cuando NO hay búsqueda)
  useEffect(() => {
    const fetchMuebles = async () => {
      // Solo cargar muebles por categoría cuando NO hay búsqueda activa
      if (esBusqueda) {
        return; // La búsqueda se maneja por separado
      }
      
      try {
        setIsLoading(true);
        
        // Lógica normal por categorías
        if (categoriaSeleccionada === 'Todos') {
          const response = await MuebleService.getCatalogoMueblesAll(currentPage - 1);
          console.log('Respuesta todos los muebles:', response);
          setMuebles(response.content);
          setTotalPages(response.totalPages);
        } else {
          const categoriaEncontrada = categorias.find(cat => cat.nombreCategoria === categoriaSeleccionada);
          if (categoriaEncontrada) {
            const response = await MuebleService.getCatalogoMueblesByCategoria(currentPage - 1, categoriaEncontrada.id);
            console.log('Respuesta muebles por categoría:', response);
            setMuebles(response.content);
            setTotalPages(response.totalPages);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar muebles:', error);
        setIsLoading(false);
      }
    };
    
    // Ejecutar solo cuando NO hay búsqueda activa Y hay categorías cargadas
    if (!esBusqueda && categorias.length > 0) {
      fetchMuebles();
    }
  }, [categoriaSeleccionada, currentPage, categorias, esBusqueda]);

  // Efecto para manejar paginación en búsquedas
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (esBusqueda && filtroTexto.trim() && currentPage > 1) {
        try {
          setIsLoading(true);
          console.log('🔍 Paginación búsqueda:', filtroTexto.trim(), 'página:', currentPage);
          const response = await MuebleService.filtrarPorNombreOColor(filtroTexto.trim(), currentPage - 1);
          setMuebles(response.content);
          setTotalPages(response.totalPages);
          setIsLoading(false);
        } catch (error) {
          console.error('Error en paginación de búsqueda:', error);
          setIsLoading(false);
        }
      }
    };

    fetchSearchResults();
  }, [currentPage, esBusqueda, filtroTexto]);

  // Manejadores de eventos
  const handleClickCategoria = (categoria: string) => {
    setCategoriaSeleccionada(categoria);
    setCurrentPage(1); // Resetear a la primera página
    // Limpiar búsqueda al seleccionar categoría
    setEsBusqueda(false);
    setFiltroTexto('');
  };

  const handleMostrarTodos = () => {
    setCategoriaSeleccionada('Todos');
    setCurrentPage(1); // Resetear a la primera página
    // Limpiar búsqueda al mostrar todos
    setEsBusqueda(false);
    setFiltroTexto('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Funciones de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setFiltroTexto(valor);
    
    // Limpiar el timeout anterior si existe
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Si el campo está vacío, volver a mostrar productos por categoría inmediatamente
    if (!valor.trim()) {
      setEsBusqueda(false);
      setCurrentPage(1);
      setIsSearching(false);
      return;
    }
    
    // Configurar nuevo timeout para búsqueda (debounce de 300ms para mayor rapidez)
    const newTimeout = setTimeout(() => {
      performSearch(valor);
    }, 300);
    
    setSearchTimeout(newTimeout);
    setIsSearching(true); // Mostrar indicador de carga mientras se espera
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda ya se realiza automáticamente, solo necesitamos prevenir el submit
    if (filtroTexto.trim()) {
      // Si hay un timeout pendiente, ejecutar la búsqueda inmediatamente
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        setSearchTimeout(null);
      }
      performSearch(filtroTexto);
    }
  };

  const handleClearSearch = () => {
    // Limpiar timeout si existe
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
    
    setFiltroTexto('');
    setEsBusqueda(false);
    setCategoriaSeleccionada('Todos');
    setCurrentPage(1);
    setIsSearching(false);
  };

  // Función para obtener muebles paginados (ya no es necesaria la paginación manual)
  const getMueblesPaginados = () => {
    return muebles; // Los muebles ya vienen paginados del backend
  };

  const mueblesPaginados = getMueblesPaginados();


  return (
    <div className="catalog-main-container">
      {/* Header del catálogo */}
      <div className="catalog-header fade-in-up">
        <h1 className="catalog-title">
          <i className="fas fa-couch me-3"></i>
          Nuestro Catálogo
        </h1>
        <p className="catalog-subtitle">
          Descubre muebles únicos diseñados especialmente para tu hogar
        </p>
         <hr/>
            <div className="about-hero-divider"></div>
      </div>

      {/* Buscador */}
      <div className="search-container fade-in-up">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre o color del mueble..."
              value={filtroTexto}
              onChange={handleSearchChange}
            />
            <button type="submit" className="search-btn" disabled={isSearching}>
              {isSearching ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-search"></i>
              )}
            </button>
            {filtroTexto && (
              <button 
                type="button" 
                className="clear-search-btn" 
                onClick={handleClearSearch}
                title="Limpiar búsqueda"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </form>
        
        {esBusqueda && (
          <div className="search-results-info">
            {isSearching ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Buscando: <strong>"{filtroTexto}"</strong>
                <span className="ms-2 text-muted">(búsqueda en tiempo real activa)</span>
              </>
            ) : (
              <>
                <i className="fas fa-info-circle me-2"></i>
                Resultados para: <strong>"{filtroTexto}"</strong>
                <span className="ms-2 text-muted">(buscando en todas las categorías)</span>
              </>
            )}
            <button className="btn-link ms-2" onClick={handleClearSearch}>
              Ver todos los productos
            </button>
          </div>
        )}
      </div>

      {/* Navegación de categorías - Solo mostrar si no hay búsqueda activa */}
      {!esBusqueda && (
        <>
          {/* Mobile: Select dropdown */}
          <div className="category-dropdown-mobile fade-in-up-delay">
            <select
              value={categoriaSeleccionada}
              onChange={e => handleClickCategoria(e.target.value)}
              className="category-select-mobile"
            >
              <option value="Todos">Todos los Productos</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombreCategoria}>
                  {categoria.nombreCategoria}
                </option>
              ))}
            </select>
          </div>
          {/* Desktop: Botones */}
          <div className="professional-category-container fade-in-up-delay">
            <button 
              onClick={handleMostrarTodos} 
              className={`category-btn-professional ${categoriaSeleccionada === 'Todos' ? 'active' : ''}`}
            >
              <i className="fas fa-th-large me-2"></i>
              Todos los Productos
            </button>
            {categorias.map((categoria) => (
              <button  
                key={categoria.id} 
                className={`category-btn-professional ${categoriaSeleccionada === categoria.nombreCategoria ? 'active' : ''}`}
                onClick={() => handleClickCategoria(categoria.nombreCategoria)}
              >
                <i className="fas fa-tag me-2"></i>
                {categoria.nombreCategoria}
              </button>
            ))}
          </div>
        </>
      )}

      <hr className="section-divider" />

      {/* Sección de productos */}
      <div className='products-section'>
        {(categoriaSeleccionada || esBusqueda) && (
          <>
            {isLoading ? (
              <div className="loading-container">
                <Loader />
              </div>
            ) : mueblesPaginados.length === 0 ? (
              <div className="no-products-message">
                <i className="fas fa-search"></i>
                <h3>{esBusqueda ? 'No se encontraron productos' : 'No hay productos disponibles'}</h3>
                <p>{esBusqueda ? 'No se encontraron productos que coincidan con tu búsqueda.' : 'No se encontraron productos en la categoría seleccionada.'}</p>
              </div>
            ) : (
              <div className='products-grid'>
                {mueblesPaginados.map((mueble, index) => (
                  <Link
                    to={`/ViewMueble/${mueble.nombreMueble}`}
                    state={{ mueble }}
                    key={`${mueble.id}-${index}-${categoriaSeleccionada}`}
                    className={`product-card fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className='product-image-container'>
                      {mueble.imagenPortada ? (
                        <img 
                          className='product-image'
                          src={
                            typeof mueble.imagenPortada === 'string' 
                              ? `data:image/jpeg;base64,${mueble.imagenPortada}`
                              : `data:image/png;base64,${mueble.imagenPortada.imagenes}`
                          }
                          alt={mueble.nombreMueble}
                          onError={(e) => {
                            console.error('Error cargando imagen para:', mueble.nombreMueble);
                            e.currentTarget.style.display = 'none';
                            const placeholder = e.currentTarget.parentElement?.querySelector('.no-image-placeholder');
                            if (placeholder) {
                              (placeholder as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      {!mueble.imagenPortada && (
                        <div className="no-image-placeholder">
                          <i className="fas fa-image"></i>
                          <span>Sin imagen</span>
                        </div>
                      )}
                      <div className="product-badge">
                        <i className="fas fa-certificate me-1"></i>
                        Premium
                      </div>
                    </div>
                    <div className='product-content'>
                      <div className='product-title'>
                        {mueble.nombreMueble}
                      </div>
                      <div className='product-details'>
                        <div className='product-detail-item'>
                          <i className='fas fa-tree'></i>
                          <span>{mueble.tipoMadera}</span>
                        </div>
                        <div className='product-detail-item'>
                          <i className='fas fa-ruler'></i>
                          <span>{mueble.dimension}</span>
                        </div>
                        <div className='product-detail-item'>
                          <i className='fas fa-palette'></i>
                          <span>{mueble.colorMueble}</span>
                        </div>
                      </div>
                      <div className='product-price'>
                        {mueble.precio ? mueble.precio.toLocaleString('es-AR') : '-'}
                      </div>
                      <div className='view-more-btn' style={{ pointerEvents: 'none', opacity: 0.7 }}>
                        <i className="fas fa-eye me-2"></i>
                        Ver Detalles
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Componente de paginación - Mostrar tanto para categorías como para búsquedas */}
        {!isLoading && mueblesPaginados.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

          

    

export default CatalogoMueble;
