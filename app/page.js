'use client'

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Navbar from "./components/Navbar/Navbar";
import { Conversation } from "./components/Conversation/Conversation";
import ChatLog from "./components/ChatLog/ChatLog";
import LocationSelector from "./components/LocationSelector/LocationSelector";

// Step 1: Create a new component for the logic that uses the search params.
// This component will be wrapped in Suspense.
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


// Step 2: The main page component no longer uses useSearchParams directly.
// It is now responsible for state and providing the Suspense boundary.
export default function Home() {
  const [showChatLog, setShowChatLog] = useState(false);
  const [retakeAssessment, setRetakeAssessment] = useState(false);
  const [messages, setMessages] = useState([]);
  const [micStatus, setMicStatus] = useState('loading');
  const [micError, setMicError] = useState(null);
  const params = useSearchParams();
  const franchiseLocation = params.get('location');
  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  // The microphone check logic does not depend on the URL,
  // so it can safely stay in the main component.
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
      <Navbar setShowChatLog={setShowChatLog} retakeAssessment={retakeAssessment} chatlogIsOpen={showChatLog} showInstructorPage={true} franchiseLocation={franchiseLocation} />
      <ChatLog messages={messages} isOpen={showChatLog} />

      <div className="main-content-wrapper">
        {/*
          Step 3: Wrap the new dynamic component in Suspense.
          Provide a fallback UI to show while it loads.
        */}
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