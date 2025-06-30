'use client'
import { useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import ChatLog from '../components/ChatLog/ChatLog'
import LoginModal from '../components/LoginModal/LoginModal';

export default function InstructorPage() {
  const [showChatLog, setShowChatLog] = useState(false);
  const [retakeAssessment, setRetakeAssessment] = useState(false);
  const [messages, setMessages] = useState([]);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };
  return (
    <div>
      <Navbar setShowChatLog={setShowChatLog} retakeAssessment={retakeAssessment} chatlogIsOpen={showChatLog} showInstructorPage={false}/>
      <ChatLog messages={messages} isOpen={showChatLog} />

      <div className="main-content-wrapper">
        <LoginModal addMessage={addMessage}/>
      </div>
    </div>
  );
}
