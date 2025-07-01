'use client';

import { useState, useEffect } from 'react';
import styles from './InterviewForm.module.css';
import { Conversation } from '../Conversation/Conversation';


/**
 * An interview form that autofills user data from sessionStorage
 * and allows them to apply for a position.
 */
export default function InterviewForm() {
    // --- Existing State ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [age, setAge] = useState(18);
    const [position, setPosition] = useState('Lead Instructor');
    const [submittedData, setSubmittedData] = useState(null);

    // --- New State for UI Transitions ---
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // This effect runs once when the component mounts to load data
    useEffect(() => {
        const storedFirstName = sessionStorage.getItem('firstName');
        const storedLastName = sessionStorage.getItem('lastName');
        const storedLocation = sessionStorage.getItem('location');

        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedLocation) setLocation(storedLocation);

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { firstName, lastName, email, phone, location, age, position };
        
        setSubmittedData(formData);
        
        setIsFadingOut(true);

        setTimeout(() => {
            setIsSubmitted(true);
        }, 500); 
    };

    if (isSubmitted) {
        console.log('Form submitted:', submittedData);
        return <Conversation agentId={process.env.NEXT_PUBLIC_AGENT_INTERVIEW} interviewType='Interview' formData={submittedData}/>;
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className={`${styles.formContainer} ${isFadingOut ? styles.fadingOut : ''}`}
        >
            <h2 className={styles.header}>Before we get started...</h2>
            <div className={styles.columnBox}>
                {/* First Name */}
                <div className={styles.inputGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        readOnly={!!firstName}
                        className={!!firstName ? styles.readOnlyInput : ''}
                    />
                </div>

                {/* Last Name */}
                <div className={styles.inputGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        readOnly={!!lastName}
                        className={!!lastName ? styles.readOnlyInput : ''}
                    />
                </div>
            </div>
            

            <div className={styles.columnBox}>
                {/* User Email */}
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Phone Number */}
                <div className={styles.inputGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Location */}
            <div className={styles.inputGroup}>
                <label htmlFor="location">Location</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    readOnly={true}
                    className={styles.readOnlyInput}
                />
            </div>

            {/* Age */}
            <div className={styles.inputGroup}>
                <label htmlFor="age">Age</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    min={14}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
            </div>

            {/* Position */}
            <div className={styles.inputGroup}>
                <label htmlFor="position">Select a Position</label>
                <select
                    id="position"
                    name="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                >
                    <option value="Lead Instructor">Lead Instructor</option>
                    <option value="Lab Mentor">Lab Mentor</option>
                </select>
            </div>

            <button type="submit" className={`${styles.submitButton} btn primary-button`}>
                Begin Interview
            </button>
        </form>
    );
}