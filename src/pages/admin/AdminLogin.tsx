import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authAPI } from "../../lib/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInput = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInput) => {
    setLoading(true);
    setError("");
    try {
      const res = await authAPI.login(data);
      if (res.success && res.data.user.role === "admin") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/admin/dashboard");
      } else {
        setError("Access denied. Admin role required.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "70vh"
    }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "var(--clr-surface)",
          border: "1px solid var(--clr-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-2xl)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "var(--space-sm)" }}>
          <h2 style={{ fontSize: "var(--font-size-xl)" }}>Admin Portal Login</h2>
          <p style={{ color: "var(--clr-text-muted)", fontSize: "var(--font-size-sm)", marginTop: "var(--space-xs)" }}>
            Enter your administrative credentials to manage inventory.
          </p>
        </div>

        {error && (
          <div style={{
            padding: "var(--space-sm) var(--space-md)",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid var(--clr-danger)",
            color: "var(--clr-danger)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--font-size-sm)"
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
          <label htmlFor="email" style={{ fontSize: "var(--font-size-sm)", fontWeight: 500 }}>Email Address</label>
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

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
          <label htmlFor="password" style={{ fontSize: "var(--font-size-sm)", fontWeight: 500 }}>Password</label>
          <input
            id="password"
            type="password"
            {...register("password")}
            style={{
              padding: "var(--space-sm)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--clr-border)",
              background: "var(--clr-surface-2)",
              color: "var(--clr-text)"
            }}
          />
          {errors.password && <span style={{ color: "var(--clr-danger)", fontSize: "0.8rem" }}>{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{
            justifyContent: "center",
            marginTop: "var(--space-sm)",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
