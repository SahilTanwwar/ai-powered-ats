export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-secondary hover:bg-surface disabled:opacity-50"
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
            currentPage === page
              ? "bg-primary text-white"
              : "border border-border text-secondary hover:bg-surface"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-secondary hover:bg-surface disabled:opacity-50"
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
}
