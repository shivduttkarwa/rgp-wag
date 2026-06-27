export default function PageError() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      padding: "2rem",
      textAlign: "center",
      fontFamily: "var(--font-body)",
    }}>
      <p style={{ fontSize: "1.125rem", color: "var(--rg-navy)", fontWeight: 600 }}>
        Unable to load this page.
      </p>
      <p style={{ fontSize: "0.9rem", color: "var(--rg-text-light)" }}>
        Please check your connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "0.5rem",
          padding: "0.65rem 1.5rem",
          background: "var(--rg-navy)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--rg-radius)",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontFamily: "var(--font-body)",
        }}
      >
        Retry
      </button>
    </div>
  );
}
