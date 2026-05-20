import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { productsAPI, categoriesAPI, Product, Category } from "../lib/api";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeCategory = searchParams.get("category") || "";

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await categoriesAPI.list();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const params: { category?: string } = {};
        if (activeCategory) {
          params.category = activeCategory;
        }
        const res = await productsAPI.list(params);
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [activeCategory]);

  const handleCategorySelect = (slug: string) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <section className="page page-products" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Our Products</h1>
        <p style={{ margin: "0 auto", color: "var(--clr-text-muted)" }}>
          Browse our catalogue of premium lubricants engineered for maximum performance.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-sm)",
        justifyContent: "center",
        paddingBottom: "var(--space-md)",
        borderBottom: "1px solid var(--clr-border)"
      }}>
        <button
          onClick={() => handleCategorySelect("")}
          className="btn"
          style={{
            background: activeCategory === "" ? "var(--clr-primary)" : "var(--clr-surface)",
            color: "#fff",
            border: "1px solid var(--clr-border)",
            padding: "var(--space-sm) var(--space-md)"
          }}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.slug)}
            className="btn"
            style={{
              background: activeCategory === cat.slug ? "var(--clr-primary)" : "var(--clr-surface)",
              color: "#fff",
              border: "1px solid var(--clr-border)",
              padding: "var(--space-sm) var(--space-md)"
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
          <p style={{ color: "var(--clr-text-muted)" }}>Loading products...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
          <p style={{ color: "var(--clr-danger)" }}>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
          <p style={{ color: "var(--clr-text-muted)" }}>No products found in this category.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "var(--space-xl)"
        }}>
          {products.map((prod) => {
            const latestPrice = prod.prices?.[0];
            return (
              <div
                key={prod.id}
                style={{
                  background: "var(--clr-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--clr-border)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform var(--transition), border-color var(--transition)"
                }}
                className="product-card"
              >
                {/* Image Placeholder or actual image */}
                <div style={{
                  height: "180px",
                  background: "var(--clr-surface-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4rem",
                  borderBottom: "1px solid var(--clr-border)"
                }}>
                  {prod.image_url ? (
                    <img src={prod.image_url} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    "🛢️"
                  )}
                </div>

                <div style={{ padding: "var(--space-md)", flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                  <span style={{ fontSize: "var(--font-size-sm)", color: "var(--clr-primary)", fontWeight: 500 }}>
                    {prod.category?.name}
                  </span>
                  <h3 style={{ fontSize: "var(--font-size-lg)" }}>{prod.name}</h3>
                  <p style={{
                    color: "var(--clr-text-muted)",
                    fontSize: "var(--font-size-sm)",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    flex: 1
                  }}>
                    {prod.description || "No description provided."}
                  </p>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "var(--space-md)",
                    paddingTop: "var(--space-sm)",
                    borderTop: "1px solid var(--clr-border)"
                  }}>
                    <div>
                      {latestPrice ? (
                        <span style={{ fontWeight: 600, color: "var(--clr-accent)" }}>
                          {latestPrice.currency} {Number(latestPrice.price).toLocaleString()}
                        </span>
                      ) : (
                        <span style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)" }}>Contact for Price</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-xs)" }}>
                      <Link to={`/products/${prod.slug}`} className="btn" style={{
                        padding: "var(--space-xs) var(--space-sm)",
                        background: "var(--clr-surface-2)",
                        border: "1px solid var(--clr-border)",
                        fontSize: "0.8rem",
                        color: "var(--clr-text)"
                      }}>
                        Details
                      </Link>
                      <Link to={`/contact?product=${prod.id}`} className="btn btn-primary" style={{
                        padding: "var(--space-xs) var(--space-sm)",
                        fontSize: "0.8rem"
                      }}>
                        Enquire
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProductsPage;
