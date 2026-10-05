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
import '../../styles/mdz-theme.css';
import '../../styles/mdz-site.css';

function getPortadaSrc(mueble: Mueble): string | null {
  const portada = mueble.imagenPortada;
  if (!portada) return null;
  if (typeof portada === 'string') return `data:image/jpeg;base64,${portada}`;
  return `data:image/png;base64,${portada.imagenes}`;
}

const CatalogoMueble = () => {
  const location = useLocation();

  // Estados principales
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados de categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    () => (location.state as { categoria?: string } | null)?.categoria || 'Todos'
  );

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

      const response = await MuebleService.filtrarPorNombreOColor(searchTerm.trim(), 0);
      setMuebles(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error en búsqueda en tiempo real:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

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

  useEffect(() => {
    const fetchMuebles = async () => {
      if (esBusqueda) return;

      try {
        setIsLoading(true);

        if (categoriaSeleccionada === 'Todos') {
          const response = await MuebleService.getCatalogoMueblesAll(currentPage - 1);
          setMuebles(response.content);
          setTotalPages(response.totalPages);
        } else {
          const categoriaEncontrada = categorias.find(cat => cat.nombreCategoria === categoriaSeleccionada);
          if (categoriaEncontrada) {
            const response = await MuebleService.getCatalogoMueblesByCategoria(currentPage - 1, categoriaEncontrada.id);
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

    if (!esBusqueda && categorias.length > 0) {
      fetchMuebles();
    }
  }, [categoriaSeleccionada, currentPage, categorias, esBusqueda]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (esBusqueda && filtroTexto.trim() && currentPage > 1) {
        try {
          setIsLoading(true);
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

  const handleClickCategoria = (categoria: string) => {
    setCategoriaSeleccionada(categoria);
    setCurrentPage(1);
    setEsBusqueda(false);
    setFiltroTexto('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setFiltroTexto(valor);

    if (searchTimeout) clearTimeout(searchTimeout);

    if (!valor.trim()) {
      setEsBusqueda(false);
      setCurrentPage(1);
      setIsSearching(false);
      return;
    }

    const newTimeout = setTimeout(() => performSearch(valor), 300);
    setSearchTimeout(newTimeout);
    setIsSearching(true);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (filtroTexto.trim()) {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        setSearchTimeout(null);
      }
      performSearch(filtroTexto);
    }
  };

  const handleClearSearch = () => {
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

  return (
    <>
      {/* Header de página */}
      <div className="mdz-page-header">
        <div className="mdz-container">
          <p className="mdz-eyebrow">Catálogo</p>
          <h1>Nuestro catálogo.</h1>
          <p className="mdz-section-copy">Descubrí muebles únicos, diseñados especialmente para tu hogar.</p>
        </div>
      </div>

      <div className="mdz-container mdz-section" style={{ paddingBlockStart: 40 }}>
        {/* Buscador */}
        <form onSubmit={handleSearchSubmit} className="mdz-search" style={{ marginBottom: 28 }}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar por nombre o color del mueble..."
            value={filtroTexto}
            onChange={handleSearchChange}
          />
          {filtroTexto && (
            <button type="button" onClick={handleClearSearch} title="Limpiar búsqueda" aria-label="Limpiar búsqueda">
              <i className="fas fa-times"></i>
            </button>
          )}
          <button type="submit" disabled={isSearching} aria-label="Buscar">
            {isSearching ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-arrow-right"></i>}
          </button>
        </form>

        {esBusqueda && (
          <div className="mdz-search-meta">
            {isSearching ? (
              <span><i className="fas fa-spinner fa-spin me-1"></i> Buscando "{filtroTexto}"…</span>
            ) : (
              <span>Resultados para "{filtroTexto}"</span>
            )}
            <button onClick={handleClearSearch}>Ver todos los productos</button>
          </div>
        )}

        {/* Filtros de categoría */}
        {!esBusqueda && (
          <>
            <select
              className="mdz-select"
              value={categoriaSeleccionada}
              onChange={e => handleClickCategoria(e.target.value)}
              style={{ marginBottom: 28 }}
            >
              <option value="Todos">Todos los productos</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombreCategoria}>
                  {categoria.nombreCategoria}
                </option>
              ))}
            </select>

            <div className="mdz-filters" style={{ marginBottom: 36 }}>
              <button
                className={`mdz-btn mdz-btn-filter mdz-btn-sm ${categoriaSeleccionada === 'Todos' ? 'is-active' : ''}`}
                onClick={() => handleClickCategoria('Todos')}
              >
                Todos los productos
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  className={`mdz-btn mdz-btn-filter mdz-btn-sm ${categoriaSeleccionada === categoria.nombreCategoria ? 'is-active' : ''}`}
                  onClick={() => handleClickCategoria(categoria.nombreCategoria)}
                >
                  {categoria.nombreCategoria}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Grilla de productos */}
        {isLoading ? (
          <div className="mdz-loading-state"><Loader /></div>
        ) : muebles.length === 0 ? (
          <div className="mdz-empty-state">
            <i className="fas fa-search"></i>
            <h3>{esBusqueda ? 'No se encontraron productos' : 'No hay productos disponibles'}</h3>
            <p>{esBusqueda ? 'Probá con otro nombre o color.' : 'No hay productos en esta categoría todavía.'}</p>
          </div>
        ) : (
          <div className="mdz-product-grid">
            {muebles.map((mueble) => {
              const src = getPortadaSrc(mueble);
              return (
                <Link
                  className="mdz-product"
                  key={mueble.id}
                  to={`/ViewMueble/${mueble.nombreMueble}`}
                  state={{ mueble }}
                >
                  <div className="mdz-product-image">
                    {src ? (
                      <img src={src} alt={mueble.nombreMueble} loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--mdz-muted-foreground)' }}>
                        <i className="fas fa-image" style={{ fontSize: 28 }}></i>
                      </div>
                    )}
                    <span className="mdz-badge"><i className="fas fa-star"></i>A MEDIDA</span>
                  </div>
                  <div className="mdz-product-meta">
                    <div>
                      <h3>{mueble.nombreMueble}</h3>
                      <p>{mueble.colorMueble}{mueble.categoria ? ` · ${mueble.categoria.nombreCategoria}` : ''}</p>
                    </div>
                    <span className="mdz-product-arrow"><i className="fas fa-arrow-up-right-from-square"></i></span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading && muebles.length > 0 && totalPages > 1 && (
          <div style={{ marginTop: 40 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CatalogoMueble;
