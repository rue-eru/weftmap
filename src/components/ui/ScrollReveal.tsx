"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Reveals any element tagged `.js-reveal` as it scrolls into view.
// One global instance handles every section; tag the elements you want staggered.
export default function ScrollReveal() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>(".js-reveal");
      if (items.length === 0) return;

      // Hide only inside the no-preference branch so reduced-motion users (and a
      // JS failure) keep the elements visible at their natural CSS state.
      gsap.set(items, { opacity: 0, y: 24 });
      ScrollTrigger.batch(items, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
            overwrite: true,
          }),
      });
      ScrollTrigger.refresh();
    });
    // Revert clears the inline hidden state and kills triggers on cleanup,
    // mirroring the Hero pattern so a Strict Mode remount can't strand elements.
    return () => mm.revert();
  });

  return null;
}
