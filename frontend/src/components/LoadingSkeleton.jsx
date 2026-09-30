const LoadingSkeleton = ({ rows = 6, type = "grid" }) => {
  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="card-surface overflow-hidden">
            <div className="aspect-[4/3] animate-pulse bg-terracotta/60" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-ink/10" />
              <div className="h-3 w-full animate-pulse rounded bg-ink/10" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-ink/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink/15 border-t-copper" />
    </div>
  );
};

export default LoadingSkeleton;
