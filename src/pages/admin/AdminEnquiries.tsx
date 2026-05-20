import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { enquiriesAPI, Enquiry } from "../../lib/api";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    loadEnquiries();
  }, [filterStatus]);

  async function loadEnquiries() {
    setLoading(true);
    setError("");
    try {
      const params: { status?: string } = {};
      if (filterStatus) {
        params.status = filterStatus;
      }
      const res = await enquiriesAPI.list(params);
      if (res.success) {
        setEnquiries(res.data);
      }
    } catch (err) {
      console.error("Failed to load enquiries:", err);
      setError("Failed to load customer enquiries list.");
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id: string, status: "new" | "in_progress" | "closed") => {
    setSuccessMsg("");
    setError("");
    try {
      const res = await enquiriesAPI.updateStatus(id, status);
      if (res.success) {
        setSuccessMsg(`Status updated to "${status}" successfully!`);
        setTimeout(() => setSuccessMsg(""), 3000);
        // Update local state without full reload
        setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      }
    } catch (err) {
      console.error("Update status failed:", err);
      setError("Failed to update enquiry status.");
    }
  };

  return (
    <div className="page page-admin-enquiries" style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid var(--clr-border)", paddingBottom: "var(--space-md)" }}>
        <div>
          <Link to="/admin/dashboard" style={{ fontSize: "var(--font-size-sm)", color: "var(--clr-text-muted)" }}>
            &larr; Back to Dashboard
          </Link>
          <h1 style={{ marginTop: "var(--space-xs)" }}>Customer Enquiries</h1>
        </div>

        {/* Filter Dropdown */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
          <label htmlFor="filterStatus" style={{ fontSize: "var(--font-size-sm)", color: "var(--clr-text-muted)" }}>Filter by Status:</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "var(--space-xs) var(--space-sm)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--clr-border)",
              background: "var(--clr-surface-2)",
              color: "var(--clr-text)",
              fontSize: "var(--font-size-sm)"
            }}
          >
            <option value="">All Enquiries</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
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

      {loading ? (
        <p>Loading customer enquiries...</p>
      ) : enquiries.length === 0 ? (
        <p style={{ color: "var(--clr-text-muted)", textAlign: "center", padding: "var(--space-2xl)" }}>
          No enquiries matching the filter found.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              style={{
                background: "var(--clr-surface)",
                border: "1px solid var(--clr-border)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-lg)",
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "var(--space-md)",
                alignItems: "start"
              }}
            >
              {/* Message Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                  <h3 style={{ margin: 0 }}>{enq.name}</h3>
                  <span style={{
                    fontSize: "0.8rem",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    background:
                      enq.status === "new"
                        ? "rgba(59,130,246,0.15)"
                        : enq.status === "in_progress"
                        ? "rgba(245,158,11,0.15)"
                        : "rgba(16,185,129,0.15)",
                    color:
                      enq.status === "new"
                        ? "var(--clr-primary)"
                        : enq.status === "in_progress"
                        ? "var(--clr-accent)"
                        : "var(--clr-success)"
                  }}>
                    {enq.status}
                  </span>
                </div>

                <p style={{ fontSize: "var(--font-size-sm)", color: "var(--clr-text-muted)" }}>
                  Email: <strong>{enq.email}</strong> {enq.phone && ` | Phone: ${enq.phone}`}
                </p>

                {enq.product && (
                  <p style={{ fontSize: "var(--font-size-sm)", color: "var(--clr-primary)" }}>
                    Inquired Product: <strong>{enq.product.name}</strong>
                  </p>
                )}

                <div style={{
                  marginTop: "var(--space-sm)",
                  padding: "var(--space-sm)",
                  background: "var(--clr-surface-2)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--clr-border)",
                  fontSize: "var(--font-size-base)",
                  whiteSpace: "pre-wrap"
                }}>
                  {enq.message}
                </div>
              </div>

              {/* Status Update Control */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "var(--space-sm)",
                height: "100%",
                justifyContent: "space-between"
              }}>
                <span style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)" }}>
                  Received: {new Date(enq.created_at).toLocaleString()}
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", width: "100%", maxWidth: "160px" }}>
                  <label htmlFor={`status-${enq.id}`} style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", alignSelf: "flex-start" }}>Update Status</label>
                  <select
                    id={`status-${enq.id}`}
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value as any)}
                    style={{
                      padding: "var(--space-xs) var(--space-sm)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--clr-border)",
                      background: "var(--clr-surface-2)",
                      color: "var(--clr-text)",
                      width: "100%"
                    }}
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
