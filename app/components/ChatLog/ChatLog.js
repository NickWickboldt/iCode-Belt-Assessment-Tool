import styles from "./ChatLog.module.css";

export default function ChatLog({messages}) {
  return (
    <div className={`${styles.wrapper}` }>
      <div className={`div-container ${styles.container}`}>
           {messages.map((msg, i) => (
          <p
            key={i}
            className={
              msg.sender === 'ai'
                ? styles.aiMessage
                : styles.userMessage
            }
          >
            {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
}