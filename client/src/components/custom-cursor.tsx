/**
 * MagentaCursor — Epitaphe 360
 * Skill: UI/UX Pro Max → Signature interactive cursor
 * Dot magenta + outer ring cyan, spring physics, scale on hover
 * Desktop only (hidden on touch devices via pointer media)
 */

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_DOT   = { stiffness: 900, damping: 28 };
const SPRING_RING  = { stiffness: 160, damping: 22 };

export function MagentaCursor() {
  const dotX   = useMotionValue(-100);
  const dotY   = useMotionValue(-100);
  const ringX  = useSpring(dotX,  SPRING_RING);
  const ringY  = useSpring(dotY,  SPRING_RING);

  const dotScaleRef  = useRef(1);
  const ringScaleRef = useRef(1);
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on pointer-fine devices (no touch) + respect prefers-reduced-motion
    const mq = window.matchMedia("(pointer: fine)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches || mqReduced.matches) return;

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const onEnterClickable = () => {
      dotScaleRef.current  = 0;
      ringScaleRef.current = 2.2;
      if (dotRef.current)  dotRef.current.style.transform  = "translate(-50%,-50%) scale(0)";
      if (ringRef.current) ringRef.current.style.transform = "translate(-50%,-50%) scale(2.2)";
    };

    const onLeaveClickable = () => {
      dotScaleRef.current  = 1;
      ringScaleRef.current = 1;
      if (dotRef.current)  dotRef.current.style.transform  = "translate(-50%,-50%) scale(1)";
      if (ringRef.current) ringRef.current.style.transform = "translate(-50%,-50%) scale(1)";
    };

    const bindClickables = () => {
      const els = document.querySelectorAll(
        "a, button, [role='button'], input, textarea, select, [tabindex], .cursor-pointer"
      );
      els.forEach((el) => {
        el.addEventListener("mouseenter", onEnterClickable);
        el.addEventListener("mouseleave", onLeaveClickable);
      });
    };

    // Initial bind + observe DOM mutations for new elements
    bindClickables();
    const observer = new MutationObserver(bindClickables);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, [dotX, dotY]);

  return (
    <>
      {/* Outer ring — follows with spring lag */}
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          width:  36,
          height: 36,
          marginLeft: -18,
          marginTop:  -18,
          border: "1.5px solid rgba(6,182,212,0.75)",
          boxShadow: "0 0 12px rgba(6,182,212,0.25), inset 0 0 6px rgba(6,182,212,0.1)",
          transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1), opacity 0.2s",
          mixBlendMode: "normal",
        }}
        aria-hidden
      />

      {/* Inner dot — snaps to cursor */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          width:  8,
          height: 8,
          marginLeft: -4,
          marginTop:  -4,
          background: "#EC4899",
          boxShadow: "0 0 10px 3px rgba(236,72,153,0.55)",
          transition: "transform 0.12s cubic-bezier(0.22,1,0.36,1)",
        }}
        aria-hidden
      />

      {/* Hide native cursor site-wide on pointer-fine devices, restore on reduced-motion */}
      <style>{`
        @media (pointer: fine) {
          *, *::before, *::after { cursor: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { cursor: auto !important; }
        }
      `}</style>
    </>
  );
}
