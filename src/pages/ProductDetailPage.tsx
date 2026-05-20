import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productsAPI, Product } from "../lib/api";

function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      setError("");
      try {
        const res = await productsAPI.getBySlug(slug);
        if (res.success) {
          setProduct(res.data);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Error loading product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
        <p style={{ color: "var(--clr-text-muted)" }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
        <p style={{ color: "var(--clr-danger)" }}>{error || "Product not found."}</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: "var(--space-md)" }}>
          Back to Products
        </Link>
      </div>
    );
  }

  const latestPrice = product.prices?.[0];
  const specs = product.spec_json ? (typeof product.spec_json === 'string' ? JSON.parse(product.spec_json) : product.spec_json) : null;

  return (
    <div className="page page-product-detail" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
      <div style={{ marginBottom: "var(--space-md)" }}>
        <Link to="/products" style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)" }}>
          &larr; Back to Products
        </Link>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "var(--space-3xl)",
        alignItems: "start"
      }}>
        {/* Product Image */}
        <div style={{
          background: "var(--clr-surface)",
          border: "1px solid var(--clr-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "8rem"
        }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            "🛢️"
          )}
        </div>

        {/* Product Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <span style={{ color: "var(--clr-primary)", fontWeight: 600, textTransform: "uppercase", fontSize: "0.85rem" }}>
            {product.category?.name}
          </span>
          <h1 style={{ margin: 0, fontSize: "var(--font-size-2xl)" }}>{product.name}</h1>
          
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--clr-accent)" }}>
            {latestPrice ? (
              <span>{latestPrice.currency} {Number(latestPrice.price).toLocaleString()}</span>
            ) : (
              <span style={{ fontSize: "var(--font-size-lg)", color: "var(--clr-text-muted)" }}>Contact for Quote</span>
            )}
          </div>

          <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-base)", whiteSpace: "pre-line" }}>
            {product.description || "No description available for this product."}
          </p>

          <div style={{ marginTop: "var(--space-md)" }}>
            <Link to={`/contact?product=${product.id}`} className="btn btn-primary" style={{ padding: "var(--space-md) var(--space-2xl)" }}>
              Request Inquiry / Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Specifications & Properties */}
      {specs && Object.keys(specs).length > 0 && (
        <section style={{ marginTop: "var(--space-2xl)" }}>
          <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "var(--space-md)" }}>Technical Specifications</h2>
          <div style={{
            background: "var(--clr-surface)",
            border: "1px solid var(--clr-border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--clr-surface-2)", borderBottom: "1px solid var(--clr-border)" }}>
                  <th style={{ padding: "var(--space-md)", fontWeight: 600 }}>Parameter</th>
                  <th style={{ padding: "var(--space-md)", fontWeight: 600 }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(specs).map(([key, val]: [string, any]) => (
                  <tr key={key} style={{ borderBottom: "1px solid var(--clr-border)" }}>
                    <td style={{ padding: "var(--space-md)", color: "var(--clr-text-muted)", textTransform: "capitalize", width: "40%" }}>
                      {key.replace(/_/g, " ")}
                    </td>
                    <td style={{ padding: "var(--space-md)", fontWeight: 500 }}>
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetailPage;
