/**
 * Skeleton â€” animated placeholder for loading states
 * 
 * Usage:
 *   <Skeleton className="h-10 w-32 rounded-lg" />
 *   <Skeleton.Card rows={3} />
 */
function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

// Skeleton card preset
Skeleton.Card = function SkeletonCard({ rows = 2, className = "" }) {
  return (
    <div className={`card p-5 ${className}`}>
      <Skeleton className="h-4 w-1/2 mb-4 rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={`h-3 mb-2 rounded ${i === rows - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
};

// Skeleton row for tables
Skeleton.Row = function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 rounded" style={{ width: `${40 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
};

export default Skeleton;
