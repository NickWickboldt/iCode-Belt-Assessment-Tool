"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useState, useEffect } from "react";
import Subtitles from "../Subtitles/Subtitles";
import Recommendation from "../Recommendation/Recommendation";

import styles from "./Conversation.module.css";

export function Conversation({ addMessage }) {
  const [transcript, setTranscript] = useState("");
  const [isRecommendation, setIsRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState(''); 

  const conversation = useConversation({
    clientTools: {
      issueRecommendation: async ({ belt }) => {
        setRecommendation(belt); 
        setIsRecommendation(true);
      },
    },
    streaming: true,
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (msg) => {
      let payload = typeof msg === "string" ? JSON.parse(msg) : msg;
      const text = payload.text ?? payload.message ?? "";
      console.log(text);
      setTranscript(text);
      if(payload.source == 'user')
      {
        addMessage({ sender: "user", text });
      }else{
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
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_KEY,
      });
    } catch (e) {
      console.error("Failed to start:", e);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div>
      <div className={styles.conversationContainer}>
        <div className={styles.buttonGroup}>
          {conversation.status !== "connected" ? (
            <button
              onClick={startConversation}
              className={`primary-button btn`}
            >
              Start Assessment
            </button>
          ) : (
            <button
              onClick={stopConversation}
              className={`danger-button btn`}
            >
              Stop Assessment
            </button>
          )}
        </div>

        <div className={styles.statusInfo}>
          <p>
            Assessment:{" "}
            {conversation.status == "disconnected" ? "Inactive" : "Active"}
          </p>
          <p>Codie is {conversation.isSpeaking ? "speaking" : "listening"}</p>
        </div>
        {isRecommendation ? <Recommendation recommendation={recommendation}/> : <></>}
      </div>
      <Subtitles text={transcript} />
    </div>
  );
}
