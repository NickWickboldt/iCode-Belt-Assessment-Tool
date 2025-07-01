'use client'
import { useState, useEffect } from 'react'; // Import useEffect
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar/Navbar';
import ChatLog from '../components/ChatLog/ChatLog';
import LocationSelector from '../components/LocationSelector/LocationSelector';
import InterviewForm from '../components/InterviewForm/InterviewForm';
import { Suspense } from 'react';


export default function InterviewPage() {
  return (
    <Suspense fallback={<div>Loading interview page...</div>}>
      <InstructorPage />
    </Suspense>
  );
}

function InstructorPage() {
    const [showChatLog, setShowChatLog] = useState(false);
    const [retakeAssessment, setRetakeAssessment] = useState(false);
    const [messages, setMessages] = useState([]);
    
    // This state will now be the single source of truth for the location
    const [franchiseLocation, setFranchiseLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Added for a better UX

    const params = useSearchParams();

    // The useEffect hook fixes the "too many re-renders" error
    useEffect(() => {
        const locationFromParams = params.get('location');
        const locationFromSession = sessionStorage.getItem('location');

        // Prioritize URL param, but fall back to session storage
        if (locationFromParams) {
            setFranchiseLocation(locationFromParams);
            sessionStorage.setItem('location', locationFromParams)
        } else if (locationFromSession) {
            setFranchiseLocation(locationFromSession);
        }
        
        setIsLoading(false); // We're done checking, so we can render the page
    }, [params]); // The dependency array ensures this runs only when params change

    // This function will be passed to LocationSelector to update the parent state
    const handleLocationSelected = (location) => {
        setFranchiseLocation(location);
    };

    // While checking for location, show nothing to prevent flashes of content
    if (isLoading) {
        return null; 
    }

    return (
        <div>
            <Navbar setShowChatLog={setShowChatLog} retakeAssessment={retakeAssessment} chatlogIsOpen={showChatLog} showInstructorPage={false} />
            <ChatLog messages={messages} isOpen={showChatLog} />

            <div className="main-content-wrapper">
                {!franchiseLocation
                    ? (
                        // Pass the callback function to LocationSelector
                        <LocationSelector askName={true} onLocationSelected={handleLocationSelected} />
                    )
                    : (
                        <InterviewForm />
                    )
                }
            </div>
        </div>
    );
}