import React, { useState } from "react";
import { TfiArrowLeft, TfiArrowRight } from "react-icons/tfi";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
}

export const Pagination = ({
  totalItems,
  itemsPerPage,
  handlePageChange
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevPage = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    handlePageChange(newPage);
  };

  const handleNextPage = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    handlePageChange(newPage);
  };

  return (
    <div className="flex items-center justify-center gap-2 py-4 dark:bg-[#161616]">
      {/* Botón de página anterior */}
      <button
        className={`buttonWithIcon ${
          currentPage === 1 ? "cursor-not-allowed" : ""
        }`}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <TfiArrowLeft />
        <span>Anterior</span>
      </button>
      
      {/* Botones de páginas */}
      <div className="items-center hidden lg:flex gap-x-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-2 py-2 text-sm ${
              currentPage === i + 1
                ? "text-white bg-orange-500/60"
                : "text-gray-500 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      
      {/* Botón de página siguiente */}
      <button
        className={`buttonWithIcon ${
          currentPage === totalPages ? "cursor-not-allowed" : ""
        }`}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <span>Siguiente</span>
        <TfiArrowRight />
      </button>
    </div>
  );
};
