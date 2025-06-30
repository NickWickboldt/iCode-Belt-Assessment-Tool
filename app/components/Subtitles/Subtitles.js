'use client'
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Subtitles.module.css';

/**
 * A component for rendering subtitles at the bottom of the screen.
 * The width and height are dynamic based on the length of the current text.
 * It gracefully animates in and out.
 *
 * @param {object} props - The component props.
 * @param {string} props.text - The subtitle text to display. If empty or null, the component will not render.
 */
export default function Subtitles({ text }) {
  return (
    // AnimatePresence handles the mounting and unmounting of the component
    // when the 'text' prop changes, allowing for exit animations.

    <AnimatePresence>
      {text && (
        <motion.div
          className={styles.subtitlesContainer}
          // Animation properties from Framer Motion
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <p className={styles.subtitleText}>{text}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
