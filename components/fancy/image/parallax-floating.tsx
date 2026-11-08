"use client";

import { createContext, useContext, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";

type FloatingContextValue = { x: MotionValue<number>; y: MotionValue<number> };

const FloatingContext = createContext<FloatingContextValue | null>(null);

export default function Floating({ children, className = "", sensitivity = 1 }: { children: ReactNode; className?: string; sensitivity?: number }) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 80, damping: 18, mass: .45 });
  const y = useSpring(pointerY, { stiffness: 80, damping: 18, mass: .45 });

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - .5) * 20 * sensitivity);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - .5) * 20 * sensitivity);
  };

  const reset = () => { pointerX.set(0); pointerY.set(0); };

  return <FloatingContext.Provider value={{ x, y }}><div className={className} onPointerMove={move} onPointerLeave={reset}>{children}</div></FloatingContext.Provider>;
}

export function FloatingElement({ children, className = "", depth = 1 }: { children: ReactNode; className?: string; depth?: number }) {
  const floating = useContext(FloatingContext);
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const x = useTransform(floating?.x ?? fallbackX, (value) => value * depth);
  const y = useTransform(floating?.y ?? fallbackY, (value) => value * depth);

  return <motion.div className={`floating-element ${className}`} style={{ x, y }}>{children}</motion.div>;
}
