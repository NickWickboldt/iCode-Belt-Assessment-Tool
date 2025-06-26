'use client'

import styles from "./AssessmentForm.module.css";
import { useState } from 'react'

export default function AssessmentForm({ setShowConversation }) {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    const handleSubmit = () => {
        setIsVisible(false)
    }

    return (
        <div className={`${styles.container} div-container`}>
            <h2 className="header-title">Enter your details to start the assessment</h2>
            <div className="input-container">
                <label htmlFor="name">Email</label>
                <input type="email" name="email" />
            </div>
            <div className="input-container">
                <label htmlFor="phone">Phone</label>
                <input type="phone" name="phone" />
            </div>
            <button type="button" className={`btn primary-button`} onClick={() => {
                handleSubmit();
                setShowConversation(prev => !prev);
            }}>Submit</button>
        </div>
    )
}