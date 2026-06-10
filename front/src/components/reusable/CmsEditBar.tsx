import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import "./CmsEditBar.css";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export default function CmsEditBar({ pageId }: { pageId: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/cms-auth/`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.is_staff) setVisible(true); })
      .catch(() => {});
  }, []);

  if (!visible || !pageId) return null;

  return (
    <a
      className="cms-edit-bar"
      href={`${API_BASE}/cms/pages/${pageId}/edit/`}
      target="_blank"
      rel="noreferrer"
      aria-label="Edit this page in CMS"
    >
      <Pencil size={14} strokeWidth={2.5} />
      <span>Edit Page</span>
    </a>
  );
}
