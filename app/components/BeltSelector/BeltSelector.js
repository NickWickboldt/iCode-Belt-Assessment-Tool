'use client'
import React, { useState } from 'react'
import BeltData from '@/data/belt_data.json'
import styles from './BeltSelector.module.css'
import { Conversation } from '../Conversation/Conversation'

// Map belt keys to environment agent IDs
const AGENT_MAP = {
  'jr-stem': process.env.NEXT_PUBLIC_AGENT_STEM_JR,
  foundation: process.env.NEXT_PUBLIC_AGENT_FOUNDATION,
  gray: process.env.NEXT_PUBLIC_AGENT_GRAY,
  white: process.env.NEXT_PUBLIC_AGENT_WHITE,
  orange: process.env.NEXT_PUBLIC_AGENT_ORANGE,
  yellow: process.env.NEXT_PUBLIC_AGENT_YELLOW,
  green: process.env.NEXT_PUBLIC_AGENT_GREEN,
  red: process.env.NEXT_PUBLIC_AGENT_RED,
  blue: process.env.NEXT_PUBLIC_AGENT_BLUE,
  black: process.env.NEXT_PUBLIC_AGENT_BLACK,
}

export default function BeltSelector({addMessage}) {
  const entries = Object.entries(BeltData)
  const [selectedBelt, setSelectedBelt] = useState(null)
  // Header toggles between selection and conversation
  const headerText = (selectedBelt
    ? `${selectedBelt.title.toUpperCase()} Assessment`
    : 'Select your belt'
  )

  return (
    <div className={styles.container}>
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
          <Conversation addMessage={addMessage} agentId={AGENT_MAP[selectedBelt.key]}/>
          <button
            className="btn"
            onClick={() => setSelectedBelt(null)}
          >
            Back to Selection
          </button>
        </div>
      )}
    </div>
  )
}
