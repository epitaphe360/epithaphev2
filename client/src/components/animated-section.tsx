/**
 * AnimatedSection — Epitaphe 360
 * Skill: UI/UX Pro Max → Scroll-triggered entrance animations
 * Wraps any section, triggers on IntersectionObserver
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Variant = "fadeUp" | "fadeIn" | "fadeLeft" | "fadeRight" | "scale";

const variants: Record<Variant, { hidden: object; visible: object }> = {
  fadeUp: {
    hidden:  { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0   },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeLeft: {
    hidden:  { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0   },
  },
  fadeRight: {
    hidden:  { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0  },
  },
  scale: {
    hidden:  { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1    },
  },
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export function AnimatedSection({
  children,
  className = "",
  variant = "fadeUp",
  delay = 0,
  duration = 0.75,
  amount = 0.12,
  once = true,
  as = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once, amount });

  const MotionTag = (motion as any)[as] as React.ComponentType<any>;

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={variants[variant]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

/** Grid variant: staggers children on scroll */
export function AnimatedGrid({
  children,
  className = "",
  stagger = 0.1,
  delay = 0,
  amount = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Single card/item inside AnimatedGrid */
export function AnimatedItem({
  children,
  className = "",
  variant = "fadeUp",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden:  variants[variant].hidden  as any,
        visible: { ...(variants[variant].visible as object), transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
