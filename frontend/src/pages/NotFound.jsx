import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-center px-6">
      <div
        className="text-[80px] font-extrabold leading-none"
        style={{ fontFamily: "var(--font-head)", color: "var(--border)" }}
      >
        404
      </div>
      <h1
        className="text-xl font-bold"
        style={{ fontFamily: "var(--font-head)", color: "var(--text)" }}
      >
        Page not found
      </h1>
      <p className="text-sm max-w-xs" style={{ color: "var(--text3)" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-2 px-6 py-2.5 rounded-[10px] text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        style={{ background: "var(--accent)" }}
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
