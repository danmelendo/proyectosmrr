import { useEffect, useRef, useState } from "react";

// Global observer to avoid multiple instances
let globalObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, () => void>();

const getObserver = (threshold: number) => {
  if (!globalObserver) {
    globalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callback = observedElements.get(entry.target);
            if (callback) {
              callback();
              globalObserver!.unobserve(entry.target);
              observedElements.delete(entry.target);
            }
          }
        });
      },
      { threshold }
    );
  }
  return globalObserver;
};

const useRevealOnScroll = (threshold = 0.3) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = getObserver(threshold);
    const currentRef = ref.current;

    if (currentRef && !observedElements.has(currentRef)) {
      observedElements.set(currentRef, () => setIsVisible(true));
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
        observedElements.delete(currentRef);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};

export default useRevealOnScroll;