// GoalBeat AI — Loading Skeleton
export default function LoadingSkeleton({ rows = 6, type = "list" }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-10 rounded-lg"
          style={{ opacity: 1 - i * (0.08) }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass p-5 space-y-3">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-4 rounded w-3/4" />
          <div className="skeleton h-3 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
