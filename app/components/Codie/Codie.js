'use client'
import styles from "./Codie.module.css";

/**
 * A component that displays an image of Codie the robot.
 * Its position is controlled via props.
 * @param {object} props - The component props.
 * @param {string} [props.top] - The top position (e.g., '10px', '5%').
 * @param {string} [props.bottom] - The bottom position.
 * @param {string} [props.left] - The left position.
 * @param {string} [props.right] - The right position.
 */
export default function Codie({ top, bottom, left, right }) {
  const codieStyle = {
    top: top,
    bottom: bottom,
    left: left,
    right: right,
  };

  return (
    <div style={codieStyle} className={styles.codieContainer}>
      <img
        src="/codie-static.png"
        alt="Codie"
        width={600}
        height={720}
        className={styles.codieImage}
      />
    </div>
  );
}