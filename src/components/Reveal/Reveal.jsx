"use client";

import { motion } from 'framer-motion';

// Fades and lifts content in the first time it scrolls into view.
// Margin-based trigger (not a visible fraction) so very tall sections still reveal on time.
const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    transition={{ duration: 0.4, ease: 'easeOut', delay }}
  >
    {children}
  </motion.div>
);

export default Reveal;