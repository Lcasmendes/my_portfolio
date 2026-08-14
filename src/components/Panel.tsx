'use client';

import { motion } from 'framer-motion';
import { Corners } from './Ornament';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger index for entrance animation. */
  index?: number;
}

// Translucent HUD panel with a soft staggered entrance.
export default function Panel({ children, className = '', index = 0 }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.06 * index }}
      className={`hud-panel p-5 sm:p-6 ${className}`}
    >
      <Corners />
      {children}
    </motion.div>
  );
}
