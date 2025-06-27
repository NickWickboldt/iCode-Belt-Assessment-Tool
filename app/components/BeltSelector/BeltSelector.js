'use client'
import React from 'react'
import BeltData from '@/data/belt_data.json'
import styles from './BeltSelector.module.css'  // optional, for your own CSS

export default function BeltSelector() {
  // Turn your object into an array of [key, beltInfo]
  const entries = Object.entries(BeltData)
  // Or if you only need the beltInfo:
  // const belts = Object.values(BeltData)

  return (
    <div className={styles.container}>
      <h2>Select your Belt</h2>

      <div className={styles.grid}>
        {entries.map(([key, belt]) => (
          <button key={key} style={{background: belt.color}} className={`${styles.card} btn`}>
            <img src={belt.icon} alt="belt_icon" className={styles.icon} />
          </button>
        ))}
      </div>
    </div>
  )
}
