'use client'
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./components/Navbar/Navbar";
import Codie from './components/Codie/Codie';
import { Conversation } from "./components/Conversation/Conversation";
import ChatLog from "./components/ChatLog/ChatLog";
import AssessmentForm from "./components/AssessementForm/AssessementForm";


export default function Home() {
  const [showChatLog, setShowChatLog] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [micStatus, setMicStatus] = useState('loading'); 
  const [micError, setMicError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [retakeAssessment, setRetakeAssessment] = useState(false);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  useEffect(() => {
    let isMounted = true; 

    async function checkMicPermission() {
      if (!navigator.permissions || !navigator.mediaDevices) {
        console.warn("The Permissions API or MediaDevices API is not supported by this browser.");
        if (isMounted) {
          setMicStatus('denied'); 
          setMicError("Your browser doesn't support the required audio APIs.");
        }
        return;
      }

      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        
        if (isMounted) {
          setMicStatus(permissionStatus.state);

          permissionStatus.onchange = () => {
            if (isMounted) {
              setMicStatus(permissionStatus.state);
              if (permissionStatus.state === 'granted') {
                  setMicError(null);
              }
            }
          };
        }
      } catch (err) {
        console.error("Error checking microphone permissions:", err);
        if (isMounted) {
          setMicStatus('prompt'); 
          setMicError("Could not determine microphone permission status.");
        }
      }
    }

    checkMicPermission();

    return () => {
      isMounted = false;
    };
  }, []); 

  return (
    <div >
      <Navbar setShowChatLog={setShowChatLog} retakeAssessment={retakeAssessment} chatlogIsOpen={showChatLog} />
      <ChatLog messages={messages} isOpen={showChatLog} />
      
      <div className="main-content-wrapper">
        <AssessmentForm setShowConversation = {setShowConversation}/>
        <Conversation addMessage={addMessage} isOpen={showConversation} setRetakeAssessment={setRetakeAssessment}/>
      </div>

    </div>
  );
}
