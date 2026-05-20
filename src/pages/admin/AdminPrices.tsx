import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { pricesAPI, productsAPI, Product } from "../../lib/api";

const priceFormSchema = z.object({
  product_id: z.string().min(1, "Product selection is required"),
  price: z.number().positive("Price must be a positive number"),
  currency: z.string().min(1),
  effective_date: z.string().optional().or(z.literal("")),
});

type PriceFormInput = z.infer<typeof priceFormSchema>;

export default function AdminPrices() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PriceFormInput>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      product_id: "",
      price: undefined,
      currency: "INR",
      effective_date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const res = await productsAPI.list({ limit: 100 });
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to load product catalog.");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: PriceFormInput) => {
    setError("");
    setSuccessMsg("");
    try {
      const payload = {
        product_id: data.product_id,
        price: data.price,
        currency: data.currency,
        effective_date: data.effective_date || undefined,
      };

      const res = await pricesAPI.create(payload);
      if (res.success) {
        setSuccessMsg("Price published successfully!");
        reset({
          product_id: "",
          price: undefined,
          currency: "INR",
          effective_date: new Date().toISOString().split("T")[0],
        });
        loadProducts(); // refresh products list to show new pricing
      }
    } catch (err: any) {
      console.error("Price submit error:", err);
      if (err?.response?.status === 409) {
        setError("A price with this effective date already exists for this product.");
      } else {
        setError(err?.response?.data?.message || "Failed to update price.");
      }
    }
  };

  return (
    <div className="page page-admin-prices" style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
      <div>
        <Link to="/admin/dashboard" style={{ fontSize: "var(--font-size-sm)", color: "var(--clr-text-muted)" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ marginTop: "var(--space-xs)" }}>Prices Management</h1>
        <p style={{ color: "var(--clr-text-muted)" }}>Publish new effective rates for industrial lubricants.</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "var(--space-3xl)",
        alignItems: "start"
      }}>
        {/* Price Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)",
          background: "var(--clr-surface)",
          border: "1px solid var(--clr-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-2xl)"
        }}>
          <h2>Publish New Rate</h2>

          {successMsg && (
            <div style={{
              padding: "var(--space-sm) var(--space-md)",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid var(--clr-success)",
              color: "var(--clr-success)",
              borderRadius: "var(--radius-sm)"
            }}>
              ✅ {successMsg}
            </div>
          )}

          {error && (
            <div style={{
              padding: "var(--space-sm) var(--space-md)",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid var(--clr-danger)",
              color: "var(--clr-danger)",
              borderRadius: "var(--radius-sm)"
            }}>
              ❌ {error}
            </div>
          )}

          {/* Product selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label>Product *</label>
            <select {...register("product_id")} style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", border: "1px solid var(--clr-border)", background: "var(--clr-surface-2)", color: "var(--clr-text)" }}>
              <option value="">-- Select Product --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.product_id && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.product_id.message}</span>}
          </div>

          {/* Price Value */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label>Price Value *</label>
            <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", border: "1px solid var(--clr-border)", background: "var(--clr-surface-2)", color: "var(--clr-text)" }} />
            {errors.price && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.price.message}</span>}
          </div>

          {/* Currency */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label>Currency *</label>
            <select {...register("currency")} style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", border: "1px solid var(--clr-border)", background: "var(--clr-surface-2)", color: "var(--clr-text)" }}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            {errors.currency && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.currency.message}</span>}
          </div>

          {/* Effective Date */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label>Effective Date *</label>
            <input type="date" {...register("effective_date")} style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", border: "1px solid var(--clr-border)", background: "var(--clr-surface-2)", color: "var(--clr-text)" }} />
            {errors.effective_date && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.effective_date.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ justifyContent: "center", marginTop: "var(--space-sm)" }}>Publish Price</button>
        </form>

        {/* Current Prices List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <h2>Current Product Prices</h2>
          {loading ? (
            <p>Loading catalog pricing...</p>
          ) : (
            <div style={{
              background: "var(--clr-surface)",
              border: "1px solid var(--clr-border)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden"
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--clr-surface-2)", borderBottom: "1px solid var(--clr-border)" }}>
                    <th style={{ padding: "var(--space-md)" }}>Product</th>
                    <th style={{ padding: "var(--space-md)" }}>Latest Price</th>
                    <th style={{ padding: "var(--space-md)" }}>Effective Date</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => {
                    const price = prod.prices?.[0];
                    return (
                      <tr key={prod.id} style={{ borderBottom: "1px solid var(--clr-border)" }}>
                        <td style={{ padding: "var(--space-md)", fontWeight: 500 }}>{prod.name}</td>
                        <td style={{ padding: "var(--space-md)", color: "var(--clr-accent)", fontWeight: 600 }}>
                          {price ? `${price.currency} ${Number(price.price).toLocaleString()}` : "Not Set"}
                        </td>
                        <td style={{ padding: "var(--space-md)", color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)" }}>
                          {price ? new Date(price.effective_date).toLocaleDateString() : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
