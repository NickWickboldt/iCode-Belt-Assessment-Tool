'use client'
import { useState } from "react";
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

  return (
    <div >
      <Navbar setShowChatLog={setShowChatLog} />
      {showChatLog && <ChatLog messages={messages} />}

      <div className="main-content-wrapper">
        <Codie top={"45%"} right={"50%"} />
        <Conversation addMessage={addMessage} />
      </div>

    </div>
  );
}
