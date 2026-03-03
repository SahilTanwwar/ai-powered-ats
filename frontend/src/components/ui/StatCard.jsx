import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ label, value, icon: Icon, iconBg = "bg-blue-100", iconColor = "text-blue-600", trend, trendLabel, loading }) {
  const isUp   = trend > 0;
  const isDown = trend < 0;

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
            <Icon size={16} className={iconColor} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Value */}
      {loading ? (
        <div className="skeleton h-9 w-20 mb-2 rounded-lg" />
      ) : (
        <div className="font-head font-bold text-3xl text-slate-900 tracking-tight mb-1.5">
          {(value ?? 0).toLocaleString()}
        </div>
      )}

      {/* Trend */}
      {trendLabel && (
        <div className={`flex items-center gap-1 text-xs font-medium ${
          isUp ? "text-emerald-600" : isDown ? "text-red-500" : "text-slate-400"
        }`}>
          {isUp   && <TrendingUp  size={13} />}
          {isDown && <TrendingDown size={13} />}
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
