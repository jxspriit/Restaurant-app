import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl font-semibold text-copper">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink/60">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
};

export default NotFound;
