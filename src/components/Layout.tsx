import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="app-layout">
      <header className="header">
        <nav className="nav">
          <Link to="/" className="nav-logo">
            🛢️ Lubricants
          </Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Sample Lubricants. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;
