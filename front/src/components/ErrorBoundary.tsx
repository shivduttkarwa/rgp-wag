import { Component, type ErrorInfo, type ReactNode } from "react";
import "./ErrorBoundary.css";

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
        <div className="eb-root">
          <div className="eb-bg" aria-hidden="true">
            <div className="eb-glow eb-glow--1" />
            <div className="eb-glow eb-glow--2" />
            <div className="eb-grid" />
          </div>

          <div className="eb-inner">
            <p className="eb-eyebrow">Real Gold Properties</p>
            <div className="eb-icon" aria-hidden="true">!</div>
            <h1 className="eb-title">Something went wrong.</h1>
            <p className="eb-sub">
              Please refresh the page. If the problem persists, contact support.
            </p>
            <button className="eb-btn" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
