import { Star } from "lucide-react";

export default function StarRating({ rating = 0, outOf = 5 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} out of ${outOf}`}>
      {Array.from({ length: outOf }, (_, index) => {
        const filled = index < rating;
        return (
          <Star
            key={index}
            size={14}
            className={filled ? "text-yellow fill-yellow" : "text-border"}
          />
        );
      })}
    </div>
  );
}
