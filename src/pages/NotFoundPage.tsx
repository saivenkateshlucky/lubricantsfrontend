import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="page page-404">
      <h1>404 — Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">← Back to Home</Link>
    </section>
  );
}

export default NotFoundPage;
