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
  property_address?: string;
  buyer_1_full_legal_name?: string;
  address_buyer_1?: string;
  phone_buyer_1?: string;
  email_buyer_1?: string;
  buyer_2_full_legal_name?: string;
  address_buyer_2_if_different_to_buyer_1?: string;
  phone_buyer_2?: string;
  email_buyer_2?: string;
  offer_price?: string;
  initial_deposit?: string;
  balance_deposit?: string;
  will_your_offer_be_subject_to_finance?: string;
  finance_if_yes_how_many_days?: string;
  will_your_offer_be_subject_to_building_pest?: string;
  building_pest_if_yes_how_many_days?: string;
  do_you_have_any_other_conditions_for_purchase?: string;
  if_yes_please_state_brief_details?: string;
  solicitor_details?: string;
  are_you_happy_for_us_to_store_your_information_in_our_database?: string;
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
