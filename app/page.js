'use client';

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import ChatLog from "./components/ChatLog/ChatLog";
import { Conversation } from "./components/Conversation/Conversation";

function PageContent({ addMessage, setRetakeAssessment, activeBelts }) {
  return (
    <>
        <Conversation
          addMessage={addMessage}
          setRetakeAssessment={setRetakeAssessment}
          agentId={process.env.NEXT_PUBLIC_AGENT_KEY}
          activeBelts={activeBelts} // Pass activeBelts to Conversation
        />
    </>
  );
}

export default function Home() {
  const [showChatLog, setShowChatLog] = useState(false);
  const [retakeAssessment, setRetakeAssessment] = useState(false);
  const [messages, setMessages] = useState([]);
  const [micStatus, setMicStatus] = useState('loading');
  const [micError, setMicError] = useState(null);
  const [activeBelts, setActiveBelts] = useState([]); // State for active_belts

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  // Listen for postMessage to initialize data
  useEffect(() => {
    const handlePostMessage = (event) => {
      const { data } = event;
      if (data && data.event === 'initializeData' && data.payload?.active_belts) {
        console.log('Received active belts:', data.payload.active_belts);
        setActiveBelts(data.payload.active_belts);
      }
    };

    window.addEventListener('message', handlePostMessage);

    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    let isMounted = true;

    async function checkMicPermission() {
      if (!navigator.permissions || !navigator.mediaDevices) {
        console.warn("The Permissions API or MediaDevices API is not supported by this browser.");
        if (isMounted) setMicStatus('denied');
        return;
      }
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        if (isMounted) {
          setMicStatus(permissionStatus.state);
          permissionStatus.onchange = () => {
            if (isMounted) setMicStatus(permissionStatus.state);
          };
        }
      } catch (err) {
        console.error("Error checking microphone permissions:", err);
        if (isMounted) setMicStatus('prompt');
      }
    }

    checkMicPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <Navbar
        setShowChatLog={setShowChatLog}
        retakeAssessment={retakeAssessment}
        chatlogIsOpen={showChatLog}
      />
      <ChatLog messages={messages} isOpen={showChatLog} />

      <div className="main-content-wrapper">
          <PageContent
            addMessage={addMessage}
            setRetakeAssessment={setRetakeAssessment}
            activeBelts={activeBelts} 
          />
      </div>
    </div>
  );
}