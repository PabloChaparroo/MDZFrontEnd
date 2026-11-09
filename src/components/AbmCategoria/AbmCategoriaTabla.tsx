import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
import ModalGestionImagenes from '../ModalGestionImagenes/ModalGestionImagenes';
import Pagination from '../Pagination/Pagination';

// Styles
import '../../styles/mdz-theme.css';
import '../../styles/mdz-site.css';

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
  const pageSize = 10;

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
      descripcion: '',
      linkInstagram: '',
      linkFacebook: '',
      imagenes: [],
      categoria: null,
      imagenPortada: null,
    };
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoading(true);
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

  useEffect(() => {
    const fetchCategoriasParaEdicion = async () => {
      if (!editCategory) return;

      try {
        let categoriasData: Categoria[] = [];

        if (mostrarCategoriasDadasDeBaja) {
          categoriasData = await CategoriaService.getCategoriasDadasDeBaja();
        } else {
          categoriasData = await CategoriaService.getAllCategoria();
        }

        setCategoriasParaEdicion(categoriasData);
      } catch (error) {
        console.error('Error al cargar categorías para edición:', error);
        setCategoriasParaEdicion([]);
      }
    };
    fetchCategoriasParaEdicion();
  }, [refreshData, mostrarCategoriasDadasDeBaja, editCategory]);

  useEffect(() => {
    const fetchMuebles = async () => {
      try {
        setIsLoadingMuebles(true);
        if (mostrarMueblesDadosDeBaja) {
          const response = await MuebleService.getMueblesDadosDeBaja(currentPage);
          setMuebles(response.muebles || []);
          setTotalPages(response.totalPages);
        } else if (categoriaSeleccionada) {
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

  // Estado para feedback visual al copiar un link de red social
  const [copiedLink, setCopiedLink] = useState<{ id: number; tipo: 'instagram' | 'facebook' } | null>(null);

  const handleCopyLink = async (link: string, muebleId: number, tipo: 'instagram' | 'facebook') => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink({ id: muebleId, tipo });
      setTimeout(() => setCopiedLink(null), 1500);
    } catch (error) {
      console.error('Error al copiar el link:', error);
    }
  };

  const [busquedaMueble, setBusquedaMueble] = useState("");
  const [localPage, setLocalPage] = useState(0);
  const [mueblesCategoriaCompleta, setMueblesCategoriaCompleta] = useState<Mueble[] | null>(null);
  const buscandoMueble = busquedaMueble.trim() !== "";

  // La API pagina de a 12: para buscar en toda la categoría se traen todas sus páginas
  useEffect(() => {
    const catObj = categorias.find(cat => cat.nombreCategoria === categoriaSeleccionada);
    if (!buscandoMueble || mostrarMueblesDadosDeBaja || !catObj) {
      setMueblesCategoriaCompleta(null);
      return;
    }
    let cancelado = false;
    const fetchCategoriaCompleta = async () => {
      try {
        const primera = await MuebleService.getCatalogoMueblesByCategoria(0, catObj.id);
        const resto = await Promise.all(
          Array.from({ length: Math.max(primera.totalPages - 1, 0) }, (_, i) =>
            MuebleService.getCatalogoMueblesByCategoria(i + 1, catObj.id))
        );
        if (!cancelado) {
          setMueblesCategoriaCompleta([primera, ...resto].flatMap((pagina) => pagina.content));
        }
      } catch (error) {
        console.error('Error al buscar en la categoría:', error);
      }
    };
    fetchCategoriaCompleta();
    return () => { cancelado = true; };
  }, [buscandoMueble, mostrarMueblesDadosDeBaja, categoriaSeleccionada, categorias, refreshData]);

  useEffect(() => {
    if (busquedaMueble.trim() !== "") {
      const base = mueblesCategoriaCompleta ?? muebles;
      let filtrados = Array.isArray(base) ? base : [];
      filtrados = filtrados.filter(mueble =>
        mueble.nombreMueble.toLowerCase().includes(busquedaMueble.trim().toLowerCase())
      );
      setMueblesFiltrados(filtrados);
    } else {
      setMueblesFiltrados(muebles);
    }
  }, [muebles, mueblesCategoriaCompleta, busquedaMueble]);

  useEffect(() => {
    setLocalPage(0);
    setCurrentPage(0);
  }, [busquedaMueble, categoriaSeleccionada]);

  useEffect(() => {
    if (busquedaMueble.trim() !== "") {
      const pages = Math.ceil(mueblesFiltrados.length / pageSize);
      if (localPage >= pages && pages > 0) {
        setLocalPage(pages - 1);
      }
    } else {
      if (currentPage >= totalPages && totalPages > 0) {
        setCurrentPage(totalPages - 1);
      }
    }
  }, [mueblesFiltrados, busquedaMueble, localPage, currentPage, totalPages, pageSize]);

  const handleClickCategoria = (categoria: string) => {
    setCategoriaSeleccionada(categoria);
    setEditCategory(false);
    setCurrentPage(0);
    setMostrarMueblesDadosDeBaja(false);
  };

  const handleClickEditCategory = () => {
    setEditCategory(true);
    setCategoriaSeleccionada("");
    setCurrentPage(0);
    setMostrarMueblesDadosDeBaja(false);
  };

  const handleClickCategoriaButton = (_newNombreCategoria: string, cat: Categoria, modal: ModalType) => {
    setModalType(modal);
    setCategoria(cat);
    setShowEditCategory(true);
  };

  const handleToggleCategoriasDadasDeBaja = () => {
    setMostrarCategoriasDadasDeBaja(!mostrarCategoriasDadasDeBaja);
    setCategoriaSeleccionada("");
  };

  const handleClickMueble = (_newNombreMueble: string, mue: Mueble, modal: ModalType) => {
    setModalType(modal);
    setMueble(mue);
    setShowModal(true);
  };

  const handleClickImagenPortada = (mueble: Mueble) => {
    setMuebleParaImagenes(mueble);
    setShowGestionImagenes(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleGestionImagenesClose = () => {
    setShowGestionImagenes(false);
  };

  const handleImagenesActualizadas = () => {
    setRefreshData(prev => !prev);
  };

  const handleCategoryModalClose = async () => {
    setShowEditCategory(false);
    setRefreshData(prev => !prev);
  };

  const handleCategoryRefresh = async () => {
    setRefreshData(prev => !prev);

    try {
      const categoriasData = await CategoriaService.getAllCategoria();
      setCategorias(categoriasData);

      if (editCategory) {
        let categoriasParaEdicionData: Categoria[] = [];

        if (mostrarCategoriasDadasDeBaja) {
          categoriasParaEdicionData = await CategoriaService.getCategoriasDadasDeBaja();
        } else {
          categoriasParaEdicionData = categoriasData;
        }

        setCategoriasParaEdicion(categoriasParaEdicionData);
      }
    } catch (error) {
      console.error('Error al recargar categorías:', error);
      if (editCategory) {
        setCategoriasParaEdicion([]);
      }
    }
  };

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

  const mueblesVisibles = (Array.isArray(mueblesFiltrados) ?
    (busquedaMueble.trim() !== ""
      ? mueblesFiltrados.slice(localPage * pageSize, (localPage + 1) * pageSize)
      : mueblesFiltrados)
    : []);

  return (
    <>
      <div className="mdz-page-header mdz-diagonal-detail">
        <div className="mdz-container">
          <p className="mdz-eyebrow">Administración</p>
          <h1>Categorías y muebles.</h1>
          <p className="mdz-section-copy">Gestioná el catálogo: categorías, productos, imágenes y links a redes sociales.</p>
        </div>
      </div>

      <div className="mdz-container mdz-section">
        {/* Botones de categorías */}
        <div className="mdz-filters mdz-filters-scroll" style={{ marginBottom: 32 }}>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              className={`mdz-btn mdz-btn-filter ${categoriaSeleccionada === categoria.nombreCategoria ? 'is-active' : ''}`}
              onClick={() => handleClickCategoria(categoria.nombreCategoria)}
            >
              <i className="fas fa-tag"></i> {categoria.nombreCategoria}
            </button>
          ))}
          <button
            className={`mdz-btn mdz-btn-filter ${editCategory ? 'is-active' : ''}`}
            onClick={handleClickEditCategory}
          >
            <i className="fas fa-edit"></i> Editar categorías
          </button>
        </div>

        {/* Sección de edición de categorías */}
        {editCategory && (
          <div style={{ marginBottom: 48 }}>
            <div className="mdz-section-heading">
              <div>
                <p className="mdz-eyebrow">Categorías</p>
                <h2>Administración de categorías.</h2>
              </div>
              <button
                className="mdz-btn mdz-btn-brand"
                onClick={() => handleClickCategoriaButton("Nueva Categoría", initializeNewCategoria(), ModalType.CREATE)}
              >
                <i className="fas fa-plus"></i> Nueva categoría
              </button>
            </div>

            <label className="mdz-checkbox-field">
              <input
                type="checkbox"
                checked={mostrarCategoriasDadasDeBaja}
                onChange={handleToggleCategoriasDadasDeBaja}
              />
              Mostrar solo categorías dadas de baja
            </label>

            {categoriasParaEdicion.length === 0 ? (
              <div className="mdz-empty-table">
                <i className="fas fa-info-circle"></i>
                <h3>{mostrarCategoriasDadasDeBaja ? 'No hay categorías dadas de baja' : 'No hay categorías disponibles'}</h3>
                <p>{mostrarCategoriasDadasDeBaja ? 'Todas las categorías están activas actualmente.' : 'Creá una nueva categoría para comenzar.'}</p>
              </div>
            ) : (
              <div className="mdz-table-wrap">
                <table className="mdz-table mdz-cards-categoria">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Alta</th>
                      <th>Modificación</th>
                      <th>Baja</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriasParaEdicion.map((categoria, idx) => (
                      <tr key={categoria.id ? categoria.id : `new-${idx}`}>
                        <td>#{categoria.id}</td>
                        <td><strong>{categoria.nombreCategoria}</strong></td>
                        <td>{categoria.fechaAltaCategoria ? new Date(categoria.fechaAltaCategoria).toLocaleDateString() : 'N/A'}</td>
                        <td>{categoria.fechaModificacionCategoria ? new Date(categoria.fechaModificacionCategoria).toLocaleDateString() : 'N/A'}</td>
                        <td>{categoria.fechaBajaCategoria ? new Date(categoria.fechaBajaCategoria).toLocaleDateString() : <span style={{ color: 'var(--mdz-muted-foreground)' }}>-</span>}</td>
                        <td>
                          <span className={`mdz-pill ${categoria.fechaBajaCategoria ? 'mdz-pill-muted' : 'mdz-pill-success'}`}>
                            {categoria.fechaBajaCategoria ? 'Inactiva' : 'Activa'}
                          </span>
                        </td>
                        <td>
                          {!categoria.fechaBajaCategoria ? (
                            <div className="mdz-row-actions">
                              <button
                                className="mdz-icon-btn"
                                title="Editar categoría"
                                onClick={() => handleClickCategoriaButton("Editar categoría", categoria, ModalType.UPDATE)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="mdz-icon-btn"
                                title="Dar de baja categoría"
                                onClick={() => handleClickCategoriaButton("Dar de baja categoría", categoria, ModalType.BAJA_LOGICA)}
                              >
                                <i className="fas fa-ban"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="mdz-row-actions">
                              <button
                                className="mdz-icon-btn"
                                title="Eliminar definitivamente"
                                style={{ color: 'oklch(0.7 0.19 25)' }}
                                onClick={() => handleClickCategoriaButton("Eliminar categoría", categoria, ModalType.DELETE)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Sección de muebles filtrados por categoría */}
        {categoriaSeleccionada && (
          <div>
            <div className="mdz-section-heading">
              <div>
                <p className="mdz-eyebrow">Muebles</p>
                <h2>Categoría: {categoriaSeleccionada}</h2>
              </div>
            </div>

            <label className="mdz-checkbox-field">
              <input
                type="checkbox"
                checked={mostrarMueblesDadosDeBaja}
                onChange={() => setMostrarMueblesDadosDeBaja(v => !v)}
              />
              Mostrar solo muebles dados de baja
            </label>

            <div className="mdz-toolbar">
              <button
                className="mdz-btn mdz-btn-brand"
                onClick={() => handleClickMueble("Nuevo mueble", initializeNewMueble(), ModalType.CREATE)}
              >
                <i className="fas fa-plus"></i> Nuevo mueble
              </button>
              <div className="mdz-search" style={{ minWidth: 280, maxWidth: 340 }}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar mueble por nombre..."
                  value={busquedaMueble}
                  onChange={e => setBusquedaMueble(e.target.value)}
                />
              </div>
            </div>

            {isLoadingMuebles ? (
              <div className="mdz-loading-state"><Loader /></div>
            ) : mueblesVisibles.length === 0 ? (
              <div className="mdz-empty-table">
                <i className="fas fa-couch"></i>
                <h3>No hay muebles disponibles</h3>
                <p>Creá un nuevo mueble para esta categoría.</p>
              </div>
            ) : (
              <div className="mdz-table-wrap">
                <table className="mdz-table mdz-cards-mueble">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Detalles</th>
                      <th>Descripción</th>
                      <th>Redes</th>
                      <th>Imagen</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mueblesVisibles.map((mueble) => (
                      <tr key={mueble.id}>
                        <td>#{mueble.id}</td>
                        <td><strong>{mueble.nombreMueble}</strong></td>
                        <td>{mueble.categoria?.nombreCategoria || 'Sin categoría'}</td>
                        <td>
                          <div style={{ fontSize: 12.5 }}>
                            <div><i className="fas fa-palette" style={{ color: 'var(--mdz-primary)', width: 14 }}></i> {mueble.colorMueble}</div>
                            <div style={{ color: 'var(--mdz-muted-foreground)' }}>
                              <i className="fas fa-calendar-plus" style={{ width: 14 }}></i> {mueble.fechaAltaMueble ? new Date(mueble.fechaAltaMueble).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--mdz-muted-foreground)' }} title={mueble.descripcion}>
                            {mueble.descripcion}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {mueble.linkInstagram ? (
                              <button
                                type="button"
                                className="mdz-icon-btn"
                                title="Copiar link de Instagram"
                                onClick={() => handleCopyLink(mueble.linkInstagram!, mueble.id, 'instagram')}
                                style={{ color: copiedLink?.id === mueble.id && copiedLink.tipo === 'instagram' ? 'oklch(0.6 0.17 150)' : '#E1306C' }}
                              >
                                <i className={copiedLink?.id === mueble.id && copiedLink.tipo === 'instagram' ? 'fas fa-check' : 'fab fa-instagram'}></i>
                              </button>
                            ) : null}
                            {mueble.linkFacebook ? (
                              <button
                                type="button"
                                className="mdz-icon-btn"
                                title="Copiar link de Facebook"
                                onClick={() => handleCopyLink(mueble.linkFacebook!, mueble.id, 'facebook')}
                                style={{ color: copiedLink?.id === mueble.id && copiedLink.tipo === 'facebook' ? 'oklch(0.6 0.17 150)' : '#1877F2' }}
                              >
                                <i className={copiedLink?.id === mueble.id && copiedLink.tipo === 'facebook' ? 'fas fa-check' : 'fab fa-facebook'}></i>
                              </button>
                            ) : null}
                            {!mueble.linkInstagram && !mueble.linkFacebook && (
                              <span style={{ color: 'var(--mdz-muted-foreground)' }}>-</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {mueble.imagenPortada && typeof mueble.imagenPortada === 'string' ? (
                            <img
                              className="mdz-table-thumb"
                              style={{ cursor: 'pointer' }}
                              src={`data:image/jpeg;base64,${mueble.imagenPortada}`}
                              alt={mueble.nombreMueble}
                              onClick={() => handleClickImagenPortada(mueble)}
                              title="Click para gestionar imágenes"
                            />
                          ) : mueble.imagenPortada && typeof mueble.imagenPortada === 'object' && (mueble.imagenPortada as any).imagenes ? (
                            <img
                              className="mdz-table-thumb"
                              style={{ cursor: 'pointer' }}
                              src={`data:image/png;base64,${(mueble.imagenPortada as any).imagenes}`}
                              alt={mueble.nombreMueble}
                              onClick={() => handleClickImagenPortada(mueble)}
                              title="Click para gestionar imágenes"
                            />
                          ) : (mueble.imagenes || []).filter(imagen => imagen.esPortada).length > 0 ? (
                            (mueble.imagenes || []).filter(imagen => imagen.esPortada).map((imagen, index) => (
                              <img
                                key={index}
                                className="mdz-table-thumb"
                                style={{ cursor: 'pointer' }}
                                src={`data:image/png;base64,${imagen.imagenes}`}
                                alt={mueble.nombreMueble}
                                onClick={() => handleClickImagenPortada(mueble)}
                                title="Click para gestionar imágenes"
                              />
                            ))
                          ) : (
                            <button
                              className="mdz-icon-btn"
                              onClick={() => handleClickImagenPortada(mueble)}
                              title="Click para agregar imágenes"
                            >
                              <i className="fas fa-plus-circle"></i>
                            </button>
                          )}
                        </td>
                        <td>
                          {!mostrarMueblesDadosDeBaja ? (
                            <div className="mdz-row-actions">
                              <button
                                className="mdz-icon-btn"
                                title="Editar producto"
                                onClick={() => handleClickMueble("Editar producto", mueble, ModalType.UPDATE)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="mdz-icon-btn"
                                title="Dar de baja mueble"
                                onClick={() => handleClickMueble("Dar de baja mueble", mueble, ModalType.BAJA_LOGICA)}
                              >
                                <i className="fas fa-ban"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="mdz-row-actions">
                              <button
                                className="mdz-icon-btn"
                                title="Eliminar definitivamente (con sus imágenes y consultas)"
                                style={{ color: 'oklch(0.7 0.19 25)' }}
                                onClick={() => handleClickMueble("Eliminar mueble", mueble, ModalType.DELETE)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
              <Pagination
                currentPage={busquedaMueble.trim() !== "" ? localPage + 1 : currentPage + 1}
                totalPages={busquedaMueble.trim() !== "" ? Math.max(1, Math.ceil(mueblesFiltrados.length / pageSize)) : (totalPages > 0 ? totalPages : 1)}
                onPageChange={page => handlePageChange(page - 1)}
                isLoading={isLoadingMuebles}
              />
            </div>
          </div>
        )}
      </div>

      {showEditCategory && (
        <ModalABMCategoria
          show={showEditCategory}
          onHide={handleCategoryModalClose}
          modalType={modalType}
          cat={categoria}
          refreshData={handleCategoryRefresh}
        />
      )}

      {showModal && (
        <CatalogoModalMueble
          show={showModal}
          onHide={handleModalClose}
          modalType={modalType}
          mue={mueble}
          refreshData={setRefreshData}
          categoria={categoriaSeleccionada}
          categorias={categorias}
          onSolicitarBaja={() => setModalType(ModalType.BAJA_LOGICA)}
        />
      )}

      {showGestionImagenes && (
        <ModalGestionImagenes
          show={showGestionImagenes}
          onHide={handleGestionImagenesClose}
          mueble={muebleParaImagenes}
          onImagenesActualizadas={handleImagenesActualizadas}
        />
      )}
    </>
  );
};

export default CatalogoTabla;
