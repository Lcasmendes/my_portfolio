'use client';

import { motion } from 'framer-motion';
import { Flourish } from './Ornament';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

// Page heading with FFXV-style wide tracked title and a glowing underline.
export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mb-8"
    >
      {subtitle && (
        <p className="mb-2 text-xs uppercase tracking-widest2 text-frost-dim">
          {subtitle}
        </p>
      )}
      <h1 className="hud-title text-3xl sm:text-4xl">{title}</h1>
      <Flourish className="mt-4" />
    </motion.header>
  );
}
