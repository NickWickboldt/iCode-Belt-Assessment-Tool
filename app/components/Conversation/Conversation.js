'use client';

import { useConversation } from "@elevenlabs/react";
import { useCallback, useState, useEffect, useRef } from "react";
import Subtitles from "../Subtitles/Subtitles";
import Recommendation from "../Recommendation/Recommendation";
import Codie from "../Codie/Codie";
import styles from "./Conversation.module.css";
import InterviewResult from "../InterviewResult/InterviewResult";
import ReadinessComplete from "../ReadinessComplete/ReadinessComplete";


// NEW: ChatWindow helper component
function ChatWindow({ messages }) {
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className={styles.chatWindow}>
      {messages.map((msg, index) => (
        <div key={index} className={`${styles.chatBubble} ${styles[msg.sender]}`}>
          <p>{msg.text}</p>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
}


export function Conversation({ addMessage, setRetakeAssessment, agentId, interviewType = "Assessment", formData = null, belt = null, activeBelts = null }) {
  const [transcript, setTranscript] = useState("");
  const [isRecommendation, setIsRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState({});
  const [reasoning, setReasoning] = useState('');
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);
  const [interviewScore, setInterviewScore] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);
  const [readinessEvaluation, setReadinessEvaluation] = useState('');
  const [isReadinessComplete, setIsReadinessComplete] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [inputMode, setInputMode] = useState('voice');
  
  const [messages, setMessages] = useState([]);

  const conversation = useConversation({
    clientTools: {
        issueRecommendation: async ({ belt }) => {
            setRecommendation(belt);
            setIsRecommendation(true);
        },
        issueInterviewScore: async ({ score, reasoning }) => {
            setInterviewScore(score);
            setReasoning(reasoning);
            setIsInterviewCompleted(true);
        },
        issueReadinessEvaluation: async ({ evaluation }) => {
            setReadinessEvaluation(evaluation);
            setIsReadinessComplete(true);
        },
        setName: async ({ firstName, lastName }) => {
            sessionStorage.setItem('firstName', firstName);
            sessionStorage.setItem('lastName', lastName);
        },
        getActiveBelts: async () => {
            activeBelts = ["foundation belt", "orange belt", "black belt"]
            return {"beltData": activeBelts};
        },
    },
    streaming: true,
    onConnect: () => console.log("Connected"),
    onDisconnect: () => {
        console.log("Disconnected");
        setTranscript("");
    },
    onMessage: (msg) => {
        let payload = typeof msg === "string" ? JSON.parse(msg) : msg;
        const text = payload.text ?? payload.message ?? "";

        if (inputMode === 'voice') {
            setTranscript(text);
        }
        
        const newMessage = { sender: payload.source === 'user' ? 'user' : 'ai', text };
        
        setMessages(prev => [...prev, newMessage]);
        addMessage(newMessage);

        if (payload.source === 'user') {
            setIsThinking(true);
        } else {
            setIsThinking(false);
        }
    },
    onError: (err) => {
        console.error("Error:", err);
        setIsThinking(false);
    },
  });

  useEffect(() => {
    if (conversation.status !== 'connected') {
        setMessages([]);
        setIsThinking(false);
    }
  }, [conversation.status]);
  
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim() || typeof conversation.sendUserMessage !== 'function') {
        return;
    }
    
    const userMessage = { sender: 'user', text: textInput };
    setMessages(prev => [...prev, userMessage]);
    addMessage(userMessage);

    try {
        conversation.sendUserMessage(textInput);
        setTextInput("");
    } catch (err) {
        console.error("Failed to send user message:", err);
    }
  };

  const startConversation = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    setMessages([]);

    // --- MODIFICATION START ---
    // Select the correct agent ID based on the current input mode.
    const selectedAgentId = inputMode === 'voice' ? agentId.voice : agentId.text;
    console.log(agentId)
    // Add a check to ensure an ID exists for the selected mode.
    if (!selectedAgentId) {
        const errorMessage = `Configuration Error: No agent ID found for ${inputMode} mode.`;
        console.error(errorMessage);
        setError(errorMessage);
        setIsStarting(false);
        return;
    }
    // --- MODIFICATION END ---

    try {
        if (inputMode === 'voice') {
            console.log(`Starting VOICE conversation with agent: ${selectedAgentId}`);
            await navigator.mediaDevices.getUserMedia({ audio: true });
        } else {
            console.log(`Starting TEXT conversation with agent: ${selectedAgentId}`);
        }

        // Use the dynamically selected agent ID to start the session.
        await conversation.startSession({ agentId: selectedAgentId });

    } catch (e) {
        let errorMessage = "Could not start the session.";
        if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
            errorMessage = "Microphone not found. Please ensure a microphone is connected and enabled.";
        } else if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
            errorMessage = "Permission to use microphone was denied. Please allow microphone access in your browser settings.";
        }
        setError(errorMessage);
        console.error("Failed to start conversation:", e);
    } finally {
        setIsStarting(false);
    }
  }, [conversation, agentId, inputMode]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const getStatusMessage = () => {
    if (conversation.status !== 'connected') return 'Inactive';
    if (inputMode === 'text') {
        return isThinking ? 'Codie is thinking...' : 'Waiting for your message...';
    }
    if (conversation.isSpeaking) return 'Codie is speaking';
    if (isThinking) return 'Codie is thinking...';
    return 'Codie is listening';
  };

  return (
    <div className={styles.mobileWrapper}>
      <Codie top={"50%"} left={"50%"} />
      
      {inputMode === 'text' && (
        <ChatWindow messages={messages} />
      )}
      
      <div className={styles.conversationContainer}>
        {conversation.status !== "connected" && (
            <>
                <div className={styles.modeSelector}>
                    <button onClick={() => setInputMode('voice')} className={inputMode === 'voice' ? styles.activeMode : ''}>Voice Chat</button>
                    <button onClick={() => setInputMode('text')} className={inputMode === 'text' ? styles.activeMode : ''}>Text Chat</button>
                </div>
                <div className={styles.buttonGroup}>
                    <button onClick={startConversation} className={`primary-button btn`} disabled={isStarting}>{isStarting ? "Starting..." : `Start ${interviewType}`}</button>
                </div>
            </>
        )}
        {conversation.status === "connected" && (
            <>
                <div className={styles.buttonGroup}>
                    <button onClick={stopConversation} className={`danger-button btn`}>Stop {interviewType}</button>
                </div>
                <div className={styles.statusInfo}>
                    <p>{interviewType}: Active ({inputMode} mode)</p>
                    <p>{getStatusMessage()}</p>
                </div>
                {inputMode === 'text' && (
                    <form onSubmit={handleTextSubmit} className={styles.textInputForm}>
                        <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Type your message..." disabled={isThinking} />
                        <button type="submit" disabled={isThinking || !textInput.trim()}>Send</button>
                    </form>
                )}
            </>
        )}
        {error && <p className={styles.errorText}>{error}</p>}
      </div>

      {isRecommendation && <Recommendation retakeAssessment={setRetakeAssessment} recommendation={recommendation} />}
      {isInterviewCompleted && <InterviewResult score={interviewScore} reasoning={reasoning} formData={formData} />}
      {isReadinessComplete && <ReadinessComplete readinessEvaluation={readinessEvaluation} belt={belt} />}
      
      {inputMode === 'voice' && <Subtitles text={transcript} />}
    </div>
  );
}