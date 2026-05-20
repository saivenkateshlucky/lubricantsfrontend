import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { productsAPI, categoriesAPI, uploadAPI, Product, Category } from "../../lib/api";

const productFormSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category_id: z.string().min(1, "Category is required"),
  description: z.string().optional().or(z.literal("")),
  image_url: z.string().optional().or(z.literal("")),
  spec_json: z.string().refine((val) => {
    if (!val) return true;
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, "Must be valid JSON object or empty"),
});

type ProductFormInput = z.infer<typeof productFormSchema>;

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category_id: "",
      description: "",
      image_url: "",
      spec_json: "{}",
    },
  });

  const watchImageUrl = watch("image_url");

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    setError("");
    try {
      const [prodRes, catRes] = await Promise.all([
        productsAPI.list({ limit: 100 }), // fetch active products
        categoriesAPI.list(),
      ]);
      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error("Failed to load initial data", err);
      setError("Error loading admin products catalog.");
    } finally {
      setLoading(false);
    }
  }

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      // 1. Request Signed Upload URL from server
      const signRes = await uploadAPI.getSign({
        fileName: file.name,
        contentType: file.type,
      });

      if (!signRes.success || !signRes.data.signedUrl) {
        throw new Error("Failed to get upload signature");
      }

      const { signedUrl, publicUrl } = signRes.data;

      // 2. Put file to Supabase Storage via signed URL
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. Store public URL in the react-hook-form state
      setValue("image_url", publicUrl);
      setSuccessMsg("Image uploaded successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error("Image upload failed:", err);
      setUploadError("Image upload failed. Check CORS or file permissions.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormInput) => {
    setError("");
    setSuccessMsg("");
    try {
      // Parse specification JSON
      const spec_json = data.spec_json ? JSON.parse(data.spec_json) : {};

      const payload = {
        name: data.name,
        category_id: data.category_id,
        description: data.description || undefined,
        image_url: data.image_url || undefined,
        spec_json,
      };

      if (editingProduct) {
        // Update product
        const res = await productsAPI.update(editingProduct.id, payload);
        if (res.success) {
          setSuccessMsg("Product updated successfully!");
          setEditingProduct(null);
        }
      } else {
        // Create product
        const res = await productsAPI.create(payload);
        if (res.success) {
          setSuccessMsg("Product created successfully!");
        }
      }

      reset({
        name: "",
        category_id: "",
        description: "",
        image_url: "",
        spec_json: "{}",
      });
      setShowForm(false);
      loadInitialData();
    } catch (err: any) {
      console.error("Product submission failed:", err);
      setError(err?.response?.data?.message || "Failed to submit product.");
    }
  };

  const startEdit = (prod: Product) => {
    setEditingProduct(prod);
    setShowForm(true);
    reset({
      name: prod.name,
      category_id: prod.category_id,
      description: prod.description || "",
      image_url: prod.image_url || "",
      spec_json: prod.spec_json ? JSON.stringify(prod.spec_json, null, 2) : "{}",
    });
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to deactivate/soft-delete this product?")) return;
    try {
      const res = await productsAPI.delete(id);
      if (res.success) {
        setSuccessMsg("Product soft-deleted successfully.");
        loadInitialData();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Delete product error:", err);
      setError("Failed to delete product.");
    }
  };

  return (
    <div className="page page-admin-products" style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid var(--clr-border)", paddingBottom: "var(--space-md)" }}>
        <div>
          <Link to="/admin/dashboard" style={{ fontSize: "var(--font-size-sm)", color: "var(--clr-text-muted)" }}>
            &larr; Back to Dashboard
          </Link>
          <h1 style={{ marginTop: "var(--space-xs)" }}>Manage Products</h1>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            if (!showForm) {
              reset({
                name: "",
                category_id: "",
                description: "",
                image_url: "",
                spec_json: "{}",
              });
            }
          }}
          className="btn btn-primary"
          style={{ marginLeft: "auto" }}
        >
          {showForm ? "Close Form" : "Add Product"}
        </button>
      </div>

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

      {/* Product Form Section */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-lg)",
          background: "var(--clr-surface)",
          border: "1px solid var(--clr-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-2xl)"
        }}>
          <h2 style={{ gridColumn: "span 2", fontSize: "var(--font-size-lg)" }}>
            {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Product"}
          </h2>

          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              <label>Product Name *</label>
              <input type="text" {...register("name")} style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", border: "1px solid var(--clr-border)", background: "var(--clr-surface-2)", color: "var(--clr-text)" }} />
              {errors.name && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.name.message}</span>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              <label>Category *</label>
              <select {...register("category_id")} style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", border: "1px solid var(--clr-border)", background: "var(--clr-surface-2)", color: "var(--clr-text)" }}>
                <option value="">-- Select Category --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category_id && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.category_id.message}</span>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              <label>Description</label>
              <textarea rows={4} {...register("description")} style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", border: "1px solid var(--clr-border)", background: "var(--clr-surface-2)", color: "var(--clr-text)", fontFamily: "var(--font-sans)" }} />
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {/* Image Upload Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ padding: "var(--space-xs)", borderRadius: "var(--radius-sm)", color: "var(--clr-text)" }}
              />
              {uploading && <span style={{ color: "var(--clr-accent)", fontSize: "0.8rem" }}>Uploading image to Supabase...</span>}
              {uploadError && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{uploadError}</span>}
              {watchImageUrl && (
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginTop: "var(--space-xs)" }}>
                  <img src={watchImageUrl} alt="Preview" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                  <span style={{ fontSize: "var(--font-size-sm)", color: "var(--clr-text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Image linked
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              <label>Technical Specifications (JSON format)</label>
              <textarea
                rows={5}
                {...register("spec_json")}
                style={{
                  padding: "var(--space-sm)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--clr-border)",
                  background: "var(--clr-surface-2)",
                  color: "var(--clr-text)",
                  fontFamily: "monospace"
                }}
              />
              {errors.spec_json && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.spec_json.message}</span>}
            </div>
          </div>

          <div style={{ gridColumn: "span 2", display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", marginTop: "var(--space-md)" }}>
            <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); }} className="btn" style={{ background: "var(--clr-surface-2)", color: "var(--clr-text)" }}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingProduct ? "Save Changes" : "Create Product"}</button>
          </div>
        </form>
      )}

      {/* Catalog Table */}
      {loading ? (
        <p>Loading products list...</p>
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
                <th style={{ padding: "var(--space-md)" }}>Image</th>
                <th style={{ padding: "var(--space-md)" }}>Product Name</th>
                <th style={{ padding: "var(--space-md)" }}>Category</th>
                <th style={{ padding: "var(--space-md)" }}>Status</th>
                <th style={{ padding: "var(--space-md)", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: "1px solid var(--clr-border)" }}>
                  <td style={{ padding: "var(--space-md)" }}>
                    <div style={{ width: "40px", height: "40px", background: "var(--clr-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)" }}>
                      {prod.image_url ? (
                        <img src={prod.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        "🛢️"
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "var(--space-md)", fontWeight: 500 }}>
                    {prod.name}
                  </td>
                  <td style={{ padding: "var(--space-md)", color: "var(--clr-text-muted)" }}>
                    {prod.category?.name}
                  </td>
                  <td style={{ padding: "var(--space-md)" }}>
                    {prod.is_active ? (
                      <span style={{ color: "var(--clr-success)", fontSize: "var(--font-size-sm)", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>Active</span>
                    ) : (
                      <span style={{ color: "var(--clr-danger)", fontSize: "var(--font-size-sm)", background: "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>Inactive</span>
                    )}
                  </td>
                  <td style={{ padding: "var(--space-md)", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "var(--space-xs)", justifyContent: "flex-end" }}>
                      <button onClick={() => startEdit(prod)} className="btn" style={{ padding: "var(--space-xs) var(--space-sm)", background: "var(--clr-surface-2)", border: "1px solid var(--clr-border)", fontSize: "0.8rem", color: "var(--clr-text)" }}>Edit</button>
                      <button onClick={() => deleteProduct(prod.id)} className="btn" style={{ padding: "var(--space-xs) var(--space-sm)", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", fontSize: "0.8rem", color: "var(--clr-danger)" }}>Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
