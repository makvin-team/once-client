// Sandboxed iframes that need `allow-same-origin` (for cross-frame DOM access
// like anchor scrolling) can't safely carry `allow-scripts` — combining the
// two would let third-party HTML run with our origin's privileges. So we strip
// anything that could trigger script execution before handing the blob to the
// iframe. (Ported from ai-frontend; dependency-free — uses the browser's
// DOMParser.)

const HTML_TAGS_TO_REMOVE =
  "script, noscript, iframe, frame, frameset, object, embed, base";

const JS_URL_ATTRS = new Set(["href", "src", "xlink:href", "action", "formaction"]);

const sniffLooksLikeHtml = (probe: string): boolean => {
  const head = probe.replace(/^\s+/, "").toLowerCase();
  return (
    head.startsWith("<!doctype html") ||
    head.startsWith("<html") ||
    (head.startsWith("<?xml") && head.includes("<html"))
  );
};

export const isHtmlMime = (mime: string): boolean =>
  mime.startsWith("text/html") || mime.includes("xhtml");

/**
 * If `raw` is HTML (by MIME or by sniffing the first chunk), return a new blob
 * with `<script>`, nested iframes, executable preload links, refresh metas,
 * inline event handlers, and `javascript:` URLs removed. Otherwise return the
 * original blob unchanged.
 */
export const sanitizeIfHtml = async (
  raw: Blob,
  mime: string,
): Promise<{ blob: Blob; mime: string }> => {
  const mimeLooksHtml = isHtmlMime(mime);
  const probe = mimeLooksHtml ? "" : await raw.slice(0, 512).text();
  if (!mimeLooksHtml && !sniffLooksLikeHtml(probe)) {
    return { blob: raw, mime: mime || "application/octet-stream" };
  }

  const text = await raw.text();
  const parsed = new DOMParser().parseFromString(text, "text/html");

  parsed.querySelectorAll(HTML_TAGS_TO_REMOVE).forEach((n) => n.remove());
  parsed.querySelectorAll("link").forEach((el) => {
    const rel = (el.getAttribute("rel") ?? "").toLowerCase();
    const as = (el.getAttribute("as") ?? "").toLowerCase();
    if (rel.includes("modulepreload") || (rel.includes("preload") && as === "script")) {
      el.remove();
    }
  });
  parsed.querySelectorAll("meta[http-equiv]").forEach((el) => {
    const eq = (el.getAttribute("http-equiv") ?? "").toLowerCase();
    if (eq === "refresh") el.remove();
  });
  parsed.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith("on")) {
        el.removeAttribute(attr.name);
      } else if (
        JS_URL_ATTRS.has(attr.name) &&
        attr.value.trim().toLowerCase().startsWith("javascript:")
      ) {
        el.removeAttribute(attr.name);
      }
    }
  });

  const outMime = mimeLooksHtml ? mime : "text/html; charset=utf-8";
  const blob = new Blob(
    ["<!DOCTYPE html>", parsed.documentElement.outerHTML],
    { type: outMime },
  );
  return { blob, mime: outMime };
};
