import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const showEllipsis = totalPages > 7;

  if (!showEllipsis) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
  }

  return (
    <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 border-t border-[#ECA468]/5 pt-8">
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 disabled:opacity-30 hover:border-[#FADDB8] hover:text-[#D0864B] text-gray-400 transition-all group"
          title="Previous Page"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, idx) =>
            p === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold"
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(Number(p))}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${
                  currentPage === p
                    ? "bg-[#ECA468] text-white shadow-md shadow-[#ECA468]/20 scale-105"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-[#ECA468]/30 hover:bg-[#FFF8EA]"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 disabled:opacity-30 hover:border-[#FADDB8] hover:text-[#D0864B] text-gray-400 transition-all group"
          title="Next Page"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-[#ECA468]/5 rounded-2xl border border-[#ECA468]/10">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#D0864B]">
          Page <span className="text-gray-900 mx-1">{currentPage}</span> of{" "}
          <span className="text-gray-900 ml-1">{totalPages}</span>
        </span>
      </div>
    </div>
  );
};

export default Pagination;
