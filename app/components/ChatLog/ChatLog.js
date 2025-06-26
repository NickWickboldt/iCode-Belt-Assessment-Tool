import styles from "./ChatLog.module.css";
import { useRef, useEffect } from "react";

export default function ChatLog({ messages, isOpen }) {
  const containerRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      // scroll instantly; change to smooth if you like
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={
        isOpen
          ? `${styles.wrapper} ${styles.wrapperOpen}`
          : styles.wrapper
      }>
      <div className={`div-container ${styles.container}`} ref={containerRef}>
        {messages.map((msg, i) => (
          <p
            key={i}
            className={`
    ${styles.message}
    ${msg.sender === "ai" ? styles.aiMessage : styles.userMessage}
  `}
          >
            {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
}
