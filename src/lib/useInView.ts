import { useEffect, useRef } from "react";

// Fires `onEnter` once the element scrolls into the viewport. Used to emit
// section-viewed analytics events.
export function useInView(onEnter: () => void, threshold = 0.4) {
  const ref = useRef<HTMLElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || fired.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            onEnter();
            observer.disconnect();
          }
        });
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onEnter, threshold]);

  return ref;
}
