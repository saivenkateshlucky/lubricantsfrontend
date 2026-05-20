import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <div className="page page-admin-dashboard" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid var(--clr-border)", paddingBottom: "var(--space-md)" }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ color: "var(--clr-text-muted)" }}>Control center for your Lubricants website.</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn"
          style={{
            background: "var(--clr-danger)",
            color: "#fff",
            marginLeft: "auto"
          }}
        >
          Logout
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "var(--space-lg)"
      }}>
        {/* Manage Products Card */}
        <div style={{
          padding: "var(--space-xl)",
          background: "var(--clr-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--clr-border)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-sm)"
        }}>
          <span style={{ fontSize: "2rem" }}>🛢️</span>
          <h3>Inventory Management</h3>
          <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)", flex: 1 }}>
            Add, update, or deactivate products from the catalog.
          </p>
          <Link to="/admin/products" className="btn btn-primary" style={{ alignSelf: "start", marginTop: "var(--space-sm)" }}>
            Manage Products &rarr;
          </Link>
        </div>

        {/* Prices Management Card */}
        <div style={{
          padding: "var(--space-xl)",
          background: "var(--clr-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--clr-border)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-sm)"
        }}>
          <span style={{ fontSize: "2rem" }}>💰</span>
          <h3>Pricing Strategy</h3>
          <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)", flex: 1 }}>
            Publish new effective rates for industrial clients.
          </p>
          <Link to="/admin/prices" className="btn btn-primary" style={{ alignSelf: "start", marginTop: "var(--space-sm)" }}>
            Update Prices &rarr;
          </Link>
        </div>

        {/* Enquiries Management Card */}
        <div style={{
          padding: "var(--space-xl)",
          background: "var(--clr-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--clr-border)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-sm)"
        }}>
          <span style={{ fontSize: "2rem" }}>📨</span>
          <h3>Customer Enquiries</h3>
          <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)", flex: 1 }}>
            Track client requests, update status (new, in progress, closed).
          </p>
          <Link to="/admin/enquiries" className="btn btn-primary" style={{ alignSelf: "start", marginTop: "var(--space-sm)" }}>
            View Enquiries &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
