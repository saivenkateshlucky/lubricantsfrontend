import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI, Product } from "../lib/api";

function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPrices() {
      setLoading(true);
      setError("");
      try {
        const res = await productsAPI.list({ limit: 100 }); // fetch up to 100 products for pricing table
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Failed to load prices:", err);
        setError("Unable to load the pricing sheet. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadPrices();
  }, []);

  return (
    <div className="page page-pricing" style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Product Pricing Sheet</h1>
        <p style={{ margin: "0 auto", color: "var(--clr-text-muted)" }}>
          Real-time industrial bulk pricing catalog. Effective rates are updated periodically.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
          <p style={{ color: "var(--clr-text-muted)" }}>Loading pricing table...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
          <p style={{ color: "var(--clr-danger)" }}>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
          <p style={{ color: "var(--clr-text-muted)" }}>No priced products available.</p>
        </div>
      ) : (
        <div style={{
          background: "var(--clr-surface)",
          border: "1px solid var(--clr-border)",
          borderRadius: "var(--radius-md)",
          overflowX: "auto"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "var(--clr-surface-2)", borderBottom: "1px solid var(--clr-border)" }}>
                <th style={{ padding: "var(--space-md)", fontWeight: 600 }}>Product Name</th>
                <th style={{ padding: "var(--space-md)", fontWeight: 600 }}>Category</th>
                <th style={{ padding: "var(--space-md)", fontWeight: 600 }}>Latest Price</th>
                <th style={{ padding: "var(--space-md)", fontWeight: 600 }}>Effective Date</th>
                <th style={{ padding: "var(--space-md)", fontWeight: 600, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => {
                const priceObj = prod.prices?.[0];
                return (
                  <tr key={prod.id} style={{ borderBottom: "1px solid var(--clr-border)" }}>
                    <td style={{ padding: "var(--space-md)" }}>
                      <Link to={`/products/${prod.slug}`} style={{ fontWeight: 500, color: "var(--clr-text)" }}>
                        {prod.name}
                      </Link>
                    </td>
                    <td style={{ padding: "var(--space-md)", color: "var(--clr-text-muted)" }}>
                      {prod.category?.name}
                    </td>
                    <td style={{ padding: "var(--space-md)", fontWeight: 600, color: "var(--clr-accent)" }}>
                      {priceObj ? (
                        `${priceObj.currency} ${Number(priceObj.price).toLocaleString()}`
                      ) : (
                        <span style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)", fontWeight: 400 }}>Quote Required</span>
                      )}
                    </td>
                    <td style={{ padding: "var(--space-md)", color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)" }}>
                      {priceObj ? new Date(priceObj.effective_date).toLocaleDateString() : "N/A"}
                    </td>
                    <td style={{ padding: "var(--space-md)", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "var(--space-xs)", justifyContent: "flex-end" }}>
                        <Link to={`/products/${prod.slug}`} className="btn" style={{
                          padding: "var(--space-xs) var(--space-sm)",
                          background: "var(--clr-surface-2)",
                          border: "1px solid var(--clr-border)",
                          fontSize: "0.8rem",
                          color: "var(--clr-text)"
                        }}>
                          View Details
                        </Link>
                        <Link to={`/contact?product=${prod.id}`} className="btn btn-primary" style={{
                          padding: "var(--space-xs) var(--space-sm)",
                          fontSize: "0.8rem"
                        }}>
                          Enquire
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PricingPage;
