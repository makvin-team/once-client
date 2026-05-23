export function scrollToId(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export function onAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  hash: string,
) {
  if (hash.startsWith("#")) {
    e.preventDefault();
    scrollToId(hash);
  }
}
