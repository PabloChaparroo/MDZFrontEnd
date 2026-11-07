import React from 'react';
import '../../styles/mdz-theme.css';
import '../../styles/mdz-site.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false
}) => {
  // Función para generar el rango de páginas visibles
  const getVisiblePages = () => {
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
    const range = [];
    const rangeWithDots = [];

    // Calcular el rango de páginas
    for (let i = Math.max(2, currentPage - delta);
         i <= Math.min(totalPages - 1, currentPage + delta);
         i++) {
      range.push(i);
    }

    // Agregar primera página
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Agregar páginas del rango
    rangeWithDots.push(...range);

    // Agregar última página
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Si hay una sola página o menos, no mostrar paginación
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <div className="mdz-pagination">
      <div className="mdz-pagination-info">
        <span>Página {currentPage} de {totalPages}</span>
      </div>

      <div className="mdz-pagination-controls">
        {/* Botón Primera Página */}
        <button
          className="mdz-pagination-btn"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          title="Primera página"
        >
          <i className="fas fa-angle-double-left"></i>
        </button>

        {/* Botón Anterior */}
        <button
          className="mdz-pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          title="Página anterior"
        >
          <i className="fas fa-angle-left"></i>
        </button>

        {/* Números de página */}
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="mdz-pagination-dots">...</span>
            ) : (
              <button
                className={`mdz-pagination-btn ${currentPage === page ? 'is-active' : ''}`}
                onClick={() => onPageChange(page as number)}
                disabled={isLoading}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Botón Siguiente */}
        <button
          className="mdz-pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          title="Página siguiente"
        >
          <i className="fas fa-angle-right"></i>
        </button>

        {/* Botón Última Página */}
        <button
          className="mdz-pagination-btn"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          title="Última página"
        >
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="mdz-pagination-loading">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;
