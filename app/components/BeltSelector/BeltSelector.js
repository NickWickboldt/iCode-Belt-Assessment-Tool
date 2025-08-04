'use client'
import React, { useState } from 'react'
import BeltData from '@/data/belt_data.json'
import styles from './BeltSelector.module.css'
import { Conversation } from '../Conversation/Conversation'

// Map belt keys to environment agent IDs
const AGENT_MAP = {
  'jr-stem': {
    voice: process.env.NEXT_PUBLIC_AGENT_STEM_JR,
    text: process.env.NEXT_PUBLIC_AGENT_STEM_JR_TEXT,
  },
  foundation: {
    voice: process.env.NEXT_PUBLIC_AGENT_FOUNDATION,
    text: process.env.NEXT_PUBLIC_AGENT_FOUNDATION_TEXT,
  },
  gray: {
    voice: process.env.NEXT_PUBLIC_AGENT_GRAY,
    text: process.env.NEXT_PUBLIC_AGENT_GRAY_TEXT,
  },
  white: {
    voice: process.env.NEXT_PUBLIC_AGENT_WHITE,
    text: process.env.NEXT_PUBLIC_AGENT_WHITE_TEXT,
  },
  orange: {
    voice: process.env.NEXT_PUBLIC_AGENT_ORANGE,
    text: process.env.NEXT_PUBLIC_AGENT_ORANGE_TEXT,
  },
  yellow: {
    voice: process.env.NEXT_PUBLIC_AGENT_YELLOW,
    text: process.env.NEXT_PUBLIC_AGENT_YELLOW_TEXT,
  },
  green: {
    voice: process.env.NEXT_PUBLIC_AGENT_GREEN,
    text: process.env.NEXT_PUBLIC_AGENT_GREEN_TEXT,
  },
  red: {
    voice: process.env.NEXT_PUBLIC_AGENT_RED,
    text: process.env.NEXT_PUBLIC_AGENT_RED_TEXT,
  },
  blue: {
    voice: process.env.NEXT_PUBLIC_AGENT_BLUE,
    text: process.env.NEXT_PUBLIC_AGENT_BLUE_TEXT,
  },
  black: {
    voice: process.env.NEXT_PUBLIC_AGENT_BLACK,
    text: process.env.NEXT_PUBLIC_AGENT_BLACK_TEXT,
  }
}

export default function BeltSelector({addMessage}) {
  const entries = Object.entries(BeltData)
  const [selectedBelt, setSelectedBelt] = useState(null)
  // Header toggles between selection and conversation
  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  const headerText = selectedBelt
    ? `${toTitleCase(selectedBelt.title)} Readiness Assessment`
    : 'Select your belt';

  return (
    <div
      className={styles.container}
      // style={
      //   selectedBelt?.title === 'STEM Jr Belt'
      //     ? { background: selectedBelt.color }
      //     : { backgroundColor: selectedBelt?.color || '#f0f0f0' }
      // }
    >
      {/* Dynamic header in uppercase */}
      <h2>{headerText}</h2>

      {!selectedBelt ? (
        <div className={styles.grid}>
          {entries.map(([key, belt]) => (
            <button
              key={key}
              className={`${styles.card} btn`}
              style={{ background: belt.color }}
              onClick={() => setSelectedBelt({ key, ...belt })}
            >
              <img
                src={belt.icon}
                alt={`${belt.title} icon`}
                className={styles.icon}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.conversationWrapper}>
          <Conversation addMessage={addMessage} agentId={AGENT_MAP[selectedBelt.key]} belt={selectedBelt.title}/>
          <button
            className={`${styles.backButton} btn`}
            onClick={() => setSelectedBelt(null)}
          >
            Back to Selection
          </button>
        </div>
      )}
    </div>
  )
}
