// Thin analytics layer. Each call goes to window.dataLayer (GTM) if present and
// also fires a CustomEvent on window so anything (Segment, custom endpoint,
// Plausible, etc.) can subscribe without changing call sites.

export type AnalyticsEventName =
  | "page_viewed"
  | "request_demo_clicked"
  | "view_features_clicked"
  | "form_started"
  | "form_submitted"
  | "form_submit_failed"
  | "faq_opened"
  | "fraud_section_viewed"
  | "business_value_section_viewed"
  | "login_page_viewed"
  | "login_with_google_clicked"
  | "login_with_sso_clicked"
  | "login_submitted"
  | "login_failed"
  | "forgot_password_clicked";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(event: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  const data = {
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(data);

  window.dispatchEvent(new CustomEvent(`analytics:${event}`, { detail: data }));

  if (import.meta.env.DEV) {
    console.debug("[analytics]", event, payload);
  }
}
