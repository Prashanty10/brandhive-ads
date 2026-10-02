import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, limit, total, totalPages, hasNextPage, hasPrevPage } = pagination;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate range of page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "12px",
      padding: "12px 18px",
      marginTop: "24px",
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      border: "1px solid #E5E7EB",
      boxShadow: "0 1px 4px rgba(0,0,0,0.02)"
    }}>
      {/* Results Count Text */}
      <div style={{ fontSize: "13px", color: "#6B7280", fontWeight: "500" }}>
        Showing <strong style={{ color: "#111827", fontWeight: "700" }}>{startItem}</strong> to{" "}
        <strong style={{ color: "#111827", fontWeight: "700" }}>{endItem}</strong> of{" "}
        <strong style={{ color: "#111827", fontWeight: "700" }}>{total}</strong> results
      </div>

      {/* Pagination Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            color: hasPrevPage ? "#111827" : "#9CA3AF",
            fontSize: "12px",
            fontWeight: "600",
            cursor: hasPrevPage ? "pointer" : "not-allowed",
            opacity: hasPrevPage ? 1 : 0.5,
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => {
            if (hasPrevPage) e.currentTarget.style.backgroundColor = "#F9FAFB";
          }}
          onMouseLeave={(e) => {
            if (hasPrevPage) e.currentTarget.style.backgroundColor = "#FFFFFF";
          }}
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </button>

        {/* First Page shortcut if truncated */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                color: "#374151",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span style={{ color: "#9CA3AF", fontSize: "12px", padding: "0 2px" }}>...</span>
            )}
          </>
        )}

        {/* Numbered Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {pageNumbers.map((p) => {
            const isActive = p === page;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                style={{
                  minWidth: "32px",
                  height: "32px",
                  padding: "0 8px",
                  borderRadius: "8px",
                  border: isActive ? "none" : "1px solid #E5E7EB",
                  backgroundColor: isActive ? "#111827" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#374151",
                  fontSize: "12px",
                  fontWeight: isActive ? "800" : "600",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 2px 6px rgba(17, 24, 39, 0.2)" : "none",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "#F3F4F6";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Last Page shortcut if truncated */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span style={{ color: "#9CA3AF", fontSize: "12px", padding: "0 2px" }}>...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                color: "#374151",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            color: hasNextPage ? "#111827" : "#9CA3AF",
            fontSize: "12px",
            fontWeight: "600",
            cursor: hasNextPage ? "pointer" : "not-allowed",
            opacity: hasNextPage ? 1 : 0.5,
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => {
            if (hasNextPage) e.currentTarget.style.backgroundColor = "#F9FAFB";
          }}
          onMouseLeave={(e) => {
            if (hasNextPage) e.currentTarget.style.backgroundColor = "#FFFFFF";
          }}
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
