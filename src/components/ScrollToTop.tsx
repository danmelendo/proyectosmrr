import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";

    if (pathname.startsWith("/blog/")) {
      // Scroll to the start of the blog content (below hero image)
      requestAnimationFrame(() => {
        const anchor = document.getElementById("blog-content-start");
        if (anchor) {
          anchor.scrollIntoView({ behavior, block: "start" });
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior });
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
