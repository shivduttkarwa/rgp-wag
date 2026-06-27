import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
        }}>
          <p style={{ fontSize: "1.125rem", color: "var(--rg-navy)", fontWeight: 600 }}>
            Something went wrong.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--rg-text-light)" }}>
            Please refresh the page. If the problem persists, contact support.
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
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
