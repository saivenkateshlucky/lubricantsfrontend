import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { enquiriesAPI, productsAPI, Product } from "../lib/api";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
  product_id: z.string().optional().or(z.literal("")),
});

type EnquiryFormInput = z.infer<typeof enquirySchema>;

function ContactPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialProductId = searchParams.get("product") || "";

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      product_id: initialProductId,
    },
  });

  // Load all products to populate selection dropdown
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await productsAPI.list({ limit: 100 });
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Failed to load products list:", err);
      }
    }
    loadProducts();
  }, []);

  // Update form if search parameters change dynamically
  useEffect(() => {
    if (initialProductId) {
      setValue("product_id", initialProductId);
    }
  }, [initialProductId, setValue]);

  const onSubmit = async (data: EnquiryFormInput) => {
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError("");
    try {
      // Clean up empty fields
      const payload = {
        name: data.name,
        email: data.email,
        message: data.message,
        phone: data.phone || undefined,
        product_id: data.product_id || undefined,
      };

      const res = await enquiriesAPI.create(payload);
      if (res.success) {
        setSubmitSuccess(true);
        reset({
          name: "",
          email: "",
          phone: "",
          message: "",
          product_id: "",
        });
      } else {
        setSubmitError("Failed to submit enquiry. Please try again.");
      }
    } catch (err: any) {
      console.error("Enquiry submit error:", err);
      setSubmitError(
        err?.response?.data?.message || "An error occurred while submitting your enquiry."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page-contact" style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Contact & Enquiry Form</h1>
        <p style={{ margin: "0 auto", color: "var(--clr-text-muted)" }}>
          Submit your application specifications below, and our engineering team will get back to you shortly.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "var(--space-3xl)",
        alignItems: "start",
        marginTop: "var(--space-lg)"
      }}>
        {/* Contact Info card */}
        <div style={{
          background: "var(--clr-surface)",
          border: "1px solid var(--clr-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-2xl)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-lg)"
        }}>
          <h3>Antigravity Headquarters</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", color: "var(--clr-text-muted)" }}>
            <p><strong>📍 Address:</strong> 100 Industrial Parkway, Suite 400, Houston, TX 77001</p>
            <p><strong>📞 Phone:</strong> +1 (800) 555-0199</p>
            <p><strong>✉️ Support:</strong> support@lubricants.local</p>
            <p><strong>🕒 Hours:</strong> Mon-Fri, 8:00 AM - 5:00 PM CST</p>
          </div>
          <div style={{
            marginTop: "var(--space-md)",
            padding: "var(--space-md)",
            background: "var(--clr-surface-2)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--clr-border)",
            fontSize: "var(--font-size-sm)",
            color: "var(--clr-accent)"
          }}>
            ℹ️ If inquiring about a specific product, select it from the dropdown in the form to expedite technical review.
          </div>
        </div>

        {/* Enquiry Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)",
          background: "var(--clr-surface)",
          border: "1px solid var(--clr-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-2xl)"
        }}>
          <h2>Send us a Message</h2>

          {submitSuccess && (
            <div style={{
              padding: "var(--space-md)",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid var(--clr-success)",
              color: "var(--clr-success)",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--font-size-sm)"
            }}>
              ✅ Thank you! Your enquiry has been received. Our team will contact you shortly.
            </div>
          )}

          {submitError && (
            <div style={{
              padding: "var(--space-md)",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid var(--clr-danger)",
              color: "var(--clr-danger)",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--font-size-sm)"
            }}>
              ❌ {submitError}
            </div>
          )}

          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label htmlFor="name" style={{ fontSize: "var(--font-size-sm)", fontWeight: 500 }}>Full Name *</label>
            <input
              id="name"
              type="text"
              {...register("name")}
              style={{
                padding: "var(--space-sm)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--clr-border)",
                background: "var(--clr-surface-2)",
                color: "var(--clr-text)"
              }}
            />
            {errors.name && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.name.message}</span>}
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label htmlFor="email" style={{ fontSize: "var(--font-size-sm)", fontWeight: 500 }}>Email Address *</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              style={{
                padding: "var(--space-sm)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--clr-border)",
                background: "var(--clr-surface-2)",
                color: "var(--clr-text)"
              }}
            />
            {errors.email && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.email.message}</span>}
          </div>

          {/* Phone */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label htmlFor="phone" style={{ fontSize: "var(--font-size-sm)", fontWeight: 500 }}>Phone Number</label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              style={{
                padding: "var(--space-sm)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--clr-border)",
                background: "var(--clr-surface-2)",
                color: "var(--clr-text)"
              }}
            />
          </div>

          {/* Product Select */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label htmlFor="product_id" style={{ fontSize: "var(--font-size-sm)", fontWeight: 500 }}>Related Product</label>
            <select
              id="product_id"
              {...register("product_id")}
              style={{
                padding: "var(--space-sm)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--clr-border)",
                background: "var(--clr-surface-2)",
                color: "var(--clr-text)"
              }}
            >
              <option value="">-- Select a Product --</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label htmlFor="message" style={{ fontSize: "var(--font-size-sm)", fontWeight: 500 }}>Message / Application details *</label>
            <textarea
              id="message"
              rows={4}
              {...register("message")}
              placeholder="Please describe your operating conditions (viscosity, load, temperature, speed) so we can suggest the best lubricant."
              style={{
                padding: "var(--space-sm)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--clr-border)",
                background: "var(--clr-surface-2)",
                color: "var(--clr-text)",
                resize: "vertical",
                fontFamily: "var(--font-sans)"
              }}
            />
            {errors.message && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.message.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              justifyContent: "center",
              marginTop: "var(--space-sm)",
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
