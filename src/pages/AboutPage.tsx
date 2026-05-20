function AboutPage() {
  return (
    <div className="page page-about" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
      <div style={{ textAlign: "center" }}>
        <h1>About Sample Lubricants</h1>
        <p style={{ margin: "0 auto", color: "var(--clr-text-muted)" }}>
          Leading developers of heavy-duty industrial lubricants and specialty synthetic oils.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "var(--space-3xl)",
        alignItems: "center",
        marginTop: "var(--space-lg)"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <h2>Engineering Premium Lubrication Solutions</h2>
          <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-base)" }}>
            Founded on engineering excellence, Sample Lubricants manufactures superior formulations 
            designed to increase productivity and protect mission-critical equipment. Our fluids and greases 
            run in high-temperature plants, marine environments, and specialized automotive machinery globally.
          </p>
          <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-base)" }}>
            We work closely with machinery manufacturers to supply custom-blended lubricants meeting 
            rigorous specifications. Every batch is certified under ISO 9001 quality guidelines 
            to guarantee consistency and high shear stability.
          </p>
        </div>

        <div style={{
          background: "var(--clr-surface)",
          border: "1px solid var(--clr-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-2xl)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-lg)"
        }}>
          <h3 style={{ borderBottom: "1px solid var(--clr-border)", paddingBottom: "var(--space-sm)" }}>Our Core Values</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <li>
              <strong>🔬 Advanced Innovation</strong>
              <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)" }}>R&D-led development creating synthetic formulas for extreme conditions.</p>
            </li>
            <li>
              <strong>🌱 Environmental Stewardship</strong>
              <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)" }}>Formulating biodegradable options and reducing overall energy footprints.</p>
            </li>
            <li>
              <strong>🤝 Client Reliability</strong>
              <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)" }}>Prompt technical support, comprehensive oil analysis, and fast delivery timelines.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
