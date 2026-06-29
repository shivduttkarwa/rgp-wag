import { useEffect, useState } from "react";
import "./LegalPage.css";
import PageSeo from "@/components/reusable/PageSeo";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

function renderSections(html: string) {
  const parts = html.split(/(?=<h2>)/i);
  return parts
    .filter((p) => p.trim())
    .map((part, i) => (
      <div
        key={i}
        className="legal-section"
        dangerouslySetInnerHTML={{ __html: part }}
      />
    ));
}

export default function PrivacyPage() {
  const [body, setBody] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/pages/privacy/`)
      .then((r) => r.json())
      .then((d) => setBody(d.body ?? ""))
      .catch(() => setBody(""));
  }, []);

  return (
    <main className="legal-page">
      <PageSeo title="Privacy Policy" description="Real Gold Properties Privacy Policy." path="/privacy" noindex />
      <div className="legal-hero">
        <div className="legal-hero__inner">
          <span className="legal-hero__eyebrow">Real Gold Properties</span>
          <h1 className="legal-hero__title">Privacy Policy</h1>
        </div>
      </div>

      <div className="legal-content">
        <div className="legal-content__inner">
          {body === null ? (
            <p style={{ color: "#9ca3af" }}>Loading…</p>
          ) : body ? (
            renderSections(body)
          ) : (
            <p style={{ color: "#9ca3af" }}>No content yet. Add it in the CMS under Settings → Legal Pages.</p>
          )}
        </div>
      </div>
    </main>
  );
}
