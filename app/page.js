'use client';

import { useState, useEffect, Suspense } from "react";
import Navbar from "./components/Navbar/Navbar";
import ChatLog from "./components/ChatLog/ChatLog";
import LocationSelector from "./components/LocationSelector/LocationSelector";
import { Conversation } from "./components/Conversation/Conversation";
import { useSearchParams } from 'next/navigation'; 

function PageContent({ addMessage, setRetakeAssessment }) {
  const params = useSearchParams();
  const locationParam = params.get('location');
  const [franchiseLocation, setFranchiseLocation] = useState(locationParam || '');

  useEffect(() => {
    if (!locationParam) {
      const stored = sessionStorage.getItem('location');
      if (stored) {
        setFranchiseLocation(stored);
      }
    }
  }, [locationParam]);

  return (
    <>
      {!franchiseLocation ? (
        <LocationSelector askName={false} onLocationSelected={(loc) => {
          sessionStorage.setItem('location', loc);
          setFranchiseLocation(loc);
        }} />
      ) : (
        <Conversation
          addMessage={addMessage}
          setRetakeAssessment={setRetakeAssessment}
          franchiseLocation={franchiseLocation}
          agentId={process.env.NEXT_PUBLIC_AGENT_KEY}
        />
      )}
    </>
  );
}

export default function Home() {
  const [showChatLog, setShowChatLog] = useState(false);
  const [retakeAssessment, setRetakeAssessment] = useState(false);
  const [messages, setMessages] = useState([]);
  const [micStatus, setMicStatus] = useState('loading');
  const [micError, setMicError] = useState(null);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

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
        showInstructorPage={true}
        franchiseLocation={undefined} // optional: pass null or remove
      />
      <ChatLog messages={messages} isOpen={showChatLog} />

      <div className="main-content-wrapper">
        <Suspense fallback={<p>Loading location...</p>}>
          <PageContent
            addMessage={addMessage}
            setRetakeAssessment={setRetakeAssessment}
          />
        </Suspense>
      </div>
    </div>
  );
}
