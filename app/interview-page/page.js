'use client'
import { useState, useEffect } from 'react'; // Import useEffect
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar/Navbar';
import ChatLog from '../components/ChatLog/ChatLog';
import LocationSelector from '../components/LocationSelector/LocationSelector';
import InterviewForm from '../components/InterviewForm/InterviewForm';
import { Suspense } from 'react';


export default function InterviewPageContent() {
  return (
    <Suspense fallback={<div>Loading interview page...</div>}>
      <InterviewPage />
    </Suspense>
  );
}

function InterviewPage() {
    const [showChatLog, setShowChatLog] = useState(false);
    const [retakeAssessment, setRetakeAssessment] = useState(false);
    const [messages, setMessages] = useState([]);

    const addMessage = (msg) => {
        setMessages(prev => [...prev, msg]);
    };
    

    return (
        <div>
            <Navbar setShowChatLog={setShowChatLog} retakeAssessment={retakeAssessment} chatlogIsOpen={showChatLog} showInstructorPage={false} />
            <ChatLog messages={messages} isOpen={showChatLog} />

            <div className="main-content-wrapper">
                <InterviewForm addMessage={addMessage}/>
            </div>
        </div>
    );
}