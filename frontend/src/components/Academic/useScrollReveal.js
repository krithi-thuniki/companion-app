import { useState, useEffect, useRef } from "react";

export const useScrollReveal = (options = {}) => {
  const { threshold = 0.1, root = null, rootMargin = "0px" } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            obs.unobserve(entry.target); // stop observing after reveal
          }
        });
      },
      { threshold, root, rootMargin }
    );

    // Add small delay to ensure element is mounted
    const timeout = setTimeout(() => observer.observe(element), 50);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [threshold, root, rootMargin]);

  return [ref, isVisible];
};
