'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./components/Navbar/Navbar";
import Codie from './components/Codie/Codie';
import { Conversation } from "./components/Conversation/Conversation";
import ChatLog from "./components/ChatLog/ChatLog"


export default function Home() {
  const [showChatLog, setShowChatLog] = useState(false);

  const [messages, setMessages] = useState([]);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  useEffect(() => {
    async function checkAndRequestMic() {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        console.log('Mic permission status:', status.state);
        if (status.state === 'granted') {
          console.log('🎤 Already granted');
        } else if (status.state === 'denied') {
          console.warn('🚫 Microphone access denied');
        } else {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('✅ User granted mic access');
        }
      } catch (err) {
        console.error('Error checking/requesting mic:', err);
      }
    }

    checkAndRequestMic();
  }, []); // empty deps = run once on mount

  return (
    <div >
      <Navbar setShowChatLog={setShowChatLog} />
      <ChatLog messages={messages} isOpen={showChatLog} />

      <div className="main-content-wrapper">
        <Codie top={"45%"} left={"50%"} />
        <Conversation addMessage={addMessage} />
      </div>

    </div>
  );
}
