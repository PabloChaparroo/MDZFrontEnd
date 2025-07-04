import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Types
import { Categoria } from '../../types/Categoria';
import { Mueble } from '../../types/Mueble';

// Services
import { CategoriaService } from '../../services/CategoriaService';
import { MuebleService } from '../../services/MuebleService';

// Components
import Loader from '../Loader/Loader';

// Styles
import './CatalogoMueble.css';




const CatalogoMueble = () => {
  const location = useLocation();

  // Estados principales
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  // Estados de categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  // Estados de muebles
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [mueblesFiltrados, setMueblesFiltrados] = useState<Mueble[]>([]);

  // Constantes
  const ITEMS_PER_PAGE = 9;

  // Efecto para scroll al inicio cuando cambia la ubicación
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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

  // Efecto para cargar muebles según la categoría seleccionada
  useEffect(() => {
    const fetchMuebles = async () => {
      try {
        setIsLoading(true);
        const fetchedMuebles = await MuebleService.getMueblesByCategoria(categoriaSeleccionada);
        setMuebles(fetchedMuebles);
        setPage(0); // Resetear página cuando cambia la categoría
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar muebles:', error);
        setIsLoading(false);
      }
    };
    fetchMuebles();
  }, [categoriaSeleccionada]);

  // Efecto para filtrar y paginar muebles
  useEffect(() => {
    if (categoriaSeleccionada === 'Todos') {
      const paginatedMuebles = muebles.slice(0, (page + 1) * ITEMS_PER_PAGE);
      setMueblesFiltrados(paginatedMuebles);
    } else {
      const mueblesFiltrados = muebles.filter(
        mueble => mueble.categoria?.nombreCategoria === categoriaSeleccionada
      );
      setMueblesFiltrados(mueblesFiltrados);
    }
  }, [categoriaSeleccionada, muebles, page]);

  // Manejadores de eventos
  const handleClickCategoria = (categoria: string) => {
    setCategoriaSeleccionada(categoria);
  };

  const handleMostrarTodos = () => {
    setCategoriaSeleccionada('Todos');
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Verificar si hay más elementos para cargar


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
      </div>

      {/* Navegación de categorías */}
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

      <hr className="section-divider" />

      {/* Sección de productos */}
      <div className='products-section'>
        {categoriaSeleccionada && (
          <>
            {isLoading ? (
              <div className="loading-container">
                <Loader />
              </div>
            ) : mueblesFiltrados.length === 0 ? (
              <div className="no-products-message">
                <i className="fas fa-search"></i>
                <h3>No hay productos disponibles</h3>
                <p>No se encontraron productos en la categoría seleccionada.</p>
              </div>
            ) : (
              <div className='products-grid'>
                {mueblesFiltrados.map((mueble, index) => (
                  <div className={`product-card fade-in-up`} key={mueble.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className='product-image-container'>
                      {mueble.imagenes.filter(imagen => imagen.esPortada).map((imagen, imgIndex) => (
                        <img 
                          key={imgIndex}
                          className='product-image'
                          src={`data:image/png;base64,${imagen.imagenes}`}
                          alt={mueble.nombreMueble}
                        />
                      ))}
                      <div className="product-badge">
                        <i className="fas fa-certificate me-1"></i>
                        Premium
                      </div>
                    </div>
                    
                    <div className='product-content'>
                      <Link
                        className='product-title'
                        to={`/ViewMueble/${mueble.nombreMueble}`}
                        state={{ mueble }}
                      >
                        {mueble.nombreMueble}
                      </Link>
                      
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
                        {mueble.precio.toLocaleString('es-AR')}
                      </div>
                      
                      <Link 
                        className='view-more-btn' 
                        to={`/ViewMueble/${mueble.nombreMueble}`} 
                        state={{ mueble }}
                      >
                        <i className="fas fa-eye me-2"></i>
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Botón cargar más */}
        {muebles.length > (page + 1) * ITEMS_PER_PAGE && !isLoading && (
          <div className='load-more-container'>
            <button 
              onClick={handleLoadMore}
              className="load-more-btn"
            >
              <i className="fas fa-plus me-2"></i>
              Cargar Más Productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

          

    

export default CatalogoMueble;
