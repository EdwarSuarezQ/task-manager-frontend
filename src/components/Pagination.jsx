import React from "react";

/**
 * Componente de paginación reutilizable para TaskManager
 * 
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Total de páginas
 * @param {number} totalItems - Total de elementos
 * @param {number} itemsPerPage - Elementos por página
 * @param {function} onPageChange - Callback cambio de página
 * @param {function} onItemsPerPageChange - Callback cambio de límite
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      if (i > 0) pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
      <div className="flex items-center gap-2">
        <label className="text-gray-300 text-sm font-medium">Mostrando:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:border-blue-500 focus:outline-none text-sm transition-colors cursor-pointer"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-gray-300 text-sm">registros por página</span>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-600 transition-colors text-sm font-bold"
            title="Primera página"
          >
            «
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-600 transition-colors text-sm font-bold"
            title="Página anterior"
          >
            ‹
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md transition-colors text-sm font-medium shadow-sm ${
                currentPage === page
                  ? "bg-blue-600 text-white border border-blue-500"
                  : "bg-zinc-700 text-white border border-zinc-600 hover:bg-zinc-600"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-600 transition-colors text-sm font-bold"
            title="Página siguiente"
          >
            ›
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-600 transition-colors text-sm font-bold"
            title="Última página"
          >
            »
          </button>
        </div>
      )}

      <div className="text-gray-300 text-sm text-center md:text-right font-medium">
        Mostrando <span className="text-white">{startItem}</span> - <span className="text-white">{endItem}</span> de <span className="text-white">{totalItems}</span> registros
      </div>
    </div>
  );
};

export default Pagination;
