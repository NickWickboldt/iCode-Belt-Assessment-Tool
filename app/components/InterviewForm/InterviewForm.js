'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './InterviewForm.module.css';
import { Conversation } from '../Conversation/Conversation';
import { useMemo } from 'react';


/**
 * An interview form that autofills user data from sessionStorage
 * and allows them to apply for a position.
 */
export default function InterviewForm({addMessage}) {
    // --- Existing State ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [age, setAge] = useState(18);
    const [position, setPosition] = useState('Lead Instructor');
    const [submittedData, setSubmittedData] = useState(null);

    const firstNamePreFilled = useRef(false);
    const lastNamePreFilled = useRef(false);


    // --- New State for UI Transitions ---
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // This effect runs once when the component mounts to load data
    useEffect(() => {
        const storedFirstName = sessionStorage.getItem('firstName');
        const storedLastName = sessionStorage.getItem('lastName');
        const storedLocation = sessionStorage.getItem('location');

        if (storedFirstName) {
            setFirstName(storedFirstName);
            firstNamePreFilled.current = true;
        }

        if (storedLastName) {
            setLastName(storedLastName);
            lastNamePreFilled.current = true;
        }
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

    const conversationMemo = useMemo(() => {
        console.log('Form submitted:', submittedData);
        return (
            <Conversation
                addMessage={addMessage}
                agentId={process.env.NEXT_PUBLIC_AGENT_INTERVIEW}
                interviewType="Interview"
                formData={submittedData}
            />
        );
    }, [submittedData]);

    if (isSubmitted) {
        return conversationMemo;
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
                        readOnly={firstNamePreFilled.current}
                        className={firstNamePreFilled.current ? styles.readOnlyInput : ''}
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
                        readOnly={lastNamePreFilled.current}
                        className={lastNamePreFilled.current ? styles.readOnlyInput : ''}
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
                    <option value="Campus Director">Campus Director</option>
                </select>
            </div>

            <button type="submit" className={`${styles.submitButton} btn primary-button`}>
                Begin Interview
            </button>
        </form>
    );
}