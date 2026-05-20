import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="page page-home" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3xl)" }}>
      {/* Hero Section */}
      <section className="hero" style={{
        padding: "var(--space-3xl) 0",
        textAlign: "center",
        background: "radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--clr-border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-lg)"
      }}>
        <h1 style={{
          fontSize: "var(--font-size-3xl)",
          fontWeight: 800,
          background: "linear-gradient(135deg, var(--clr-text) 30%, var(--clr-primary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          maxWidth: "800px"
        }}>
          High-Performance Industrial Lubricants
        </h1>
        <p style={{
          fontSize: "var(--font-size-lg)",
          color: "var(--clr-text-muted)",
          maxWidth: "600px"
        }}>
          Engineered to optimize efficiency, protect heavy machinery, and withstand extreme industrial environments.
        </p>
        <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-md)" }}>
          <Link to="/products" className="btn btn-primary">
            Explore Products
          </Link>
          <Link to="/contact" className="btn" style={{
            background: "var(--clr-surface-2)",
            color: "var(--clr-text)",
            border: "1px solid var(--clr-border)"
          }}>
            Request a Quote
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
        <h2 style={{ textAlign: "center", fontSize: "var(--font-size-2xl)" }}>Why Choose Antigravity Lubricants?</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-lg)"
        }}>
          <div style={{
            padding: "var(--space-xl)",
            background: "var(--clr-surface)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--clr-border)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)"
          }}>
            <span style={{ fontSize: "2rem" }}>🛡️</span>
            <h3>Extreme Protection</h3>
            <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)" }}>
              Formulated with advanced anti-wear additives to extend equipment lifespan.
            </p>
          </div>
          <div style={{
            padding: "var(--space-xl)",
            background: "var(--clr-surface)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--clr-border)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)"
          }}>
            <span style={{ fontSize: "2rem" }}>⚡</span>
            <h3>Energy Efficiency</h3>
            <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)" }}>
              Optimizes friction coefficient to lower operational power consumption.
            </p>
          </div>
          <div style={{
            padding: "var(--space-xl)",
            background: "var(--clr-surface)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--clr-border)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)"
          }}>
            <span style={{ fontSize: "2rem" }}>🌡️</span>
            <h3>Thermal Stability</h3>
            <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)" }}>
              Maintains optimal viscosity index under high thermal stress and friction.
            </p>
          </div>
        </div>
      </section>

      {/* Quick CTAs */}
      <section style={{
        padding: "var(--space-2xl)",
        background: "var(--clr-surface-2)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--clr-border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-md)",
        textAlign: "center"
      }}>
        <h2>Ready to optimize your machinery?</h2>
        <p style={{ color: "var(--clr-text-muted)", maxWidth: "500px" }}>
          Get in touch with our engineers for custom formulation audits and bulk pricing options.
        </p>
        <Link to="/contact" className="btn btn-primary" style={{ marginTop: "var(--space-sm)" }}>
          Contact Our Engineers
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
