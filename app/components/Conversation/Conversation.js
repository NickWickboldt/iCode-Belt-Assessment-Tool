"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useState, useEffect } from "react";
import Subtitles from "../Subtitles/Subtitles";
import Recommendation from "../Recommendation/Recommendation";
import Codie from "../Codie/Codie";
import styles from "./Conversation.module.css";
import InterviewResult from "../InterviewResult/InterviewResult";

export function Conversation({ addMessage,setRetakeAssessment, franchiseLocation, agentId, interviewType="Assessment", formData = null }) {
  const [transcript, setTranscript] = useState("");
  const [isRecommendation, setIsRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [reasoning, setReasoning] = useState('You have no skills.');
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(true);
  const [interviewScore, setInterviewScore] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);

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
      }
    },
    streaming: true,
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (msg) => {
      let payload = typeof msg === "string" ? JSON.parse(msg) : msg;
      const text = payload.text ?? payload.message ?? "";
      console.log(text);
      setTranscript(text);
      if (payload.source == 'user') {
        addMessage({ sender: "user", text });
      } else {
        addMessage({ sender: "ai", text });
      }

    },
    onError: (err) => console.error("Error:", err),
  });

  // clear previous text when AI starts speaking
  useEffect(() => {
    if (conversation.isSpeaking) setTranscript("");
  }, [conversation.isSpeaking]);

  const startConversation = useCallback(async () => {
    setIsStarting(true);
    setError(null);

    try {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
          throw new Error("Microphone not found. Please ensure a microphone is connected and enabled.");
        } else if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
          throw new Error("Permission to use microphone was denied. Please allow microphone access in your browser settings.");
        }
        throw new Error("Could not access the microphone. Please check your hardware and browser settings.");
      }
      await conversation.startSession({
        agentId: agentId,
      });
    } catch (e) {
      setError(e.message);
      console.error("Failed to start conversation:", e);
    } finally {
      setIsStarting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div>
      <Codie top={"50%"} left={"50%"} />

      <div className={styles.conversationContainer}>
        <div className={styles.buttonGroup}>
          {conversation.status !== "connected" ? (
            <button
              onClick={startConversation}
              className={`primary-button btn`}
            >
              Start {interviewType}
            </button>
          ) : (
            <button
              onClick={stopConversation}
              className={`danger-button btn`}
            >
              Stop {interviewType}
            </button>
          )}
        </div>

        <div className={styles.statusInfo}>
          <p>
            {interviewType}:{" "}
            {conversation.status == "disconnected" ? "Inactive" : "Active"}
          </p>
          <p>Codie is {conversation.isSpeaking ? "speaking" : "listening"}</p>
        </div>
      </div>
      {isRecommendation ? <Recommendation retakeAssessment={setRetakeAssessment} recommendation={recommendation} franchiseLocation={franchiseLocation} /> : <></>}
      {isInterviewCompleted ? <InterviewResult score={interviewScore} reasoning={reasoning} formData={formData} /> : <></>}
      <Subtitles text={transcript} />
    </div>
  );
}
