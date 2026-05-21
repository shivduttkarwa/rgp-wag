const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

type EoiPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  property_type?: string;
  budget?: string;
  timeline?: string;
  message?: string;
};

async function postJson<TPayload extends object>(
  url: string,
  payload: TPayload,
): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Request failed: ${res.status}`);
  }
}

export async function submitContactForm(payload: ContactPayload): Promise<void> {
  await postJson(`${API_BASE}/api/forms/contact/`, payload);
}

export async function submitEoiForm(payload: EoiPayload): Promise<void> {
  await postJson(`${API_BASE}/api/forms/eoi/`, payload);
}
