import { motion } from "motion/react";
import type { ReactNode } from "react";

interface AnimatedContentProps {
  animationKey: string;
  children: ReactNode;
  className?: string;
}

export function AnimatedContent({ animationKey, children, className }: AnimatedContentProps) {
  return (
    <motion.div
      key={animationKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
