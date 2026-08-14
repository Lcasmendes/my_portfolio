'use client';

import { motion } from 'framer-motion';
import { usePathname } from '@/i18n/navigation';

// Keying a motion.div on the pathname remounts + re-animates it on every
// navigation. We intentionally avoid AnimatePresence `mode="wait"` here: its
// exit-then-enter handshake could stall on rapid route changes and leave the
// page blank until a hard reload.
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
