'use client'

import { useEffect } from 'react';
import styles from './InterviewResult.module.css';

const roleDescriptions = {
  'Lead Instructor': {
    responsibilities: [
      'Deliver curriculum and lead engaging lessons.',
      'Manage classroom behavior and student dynamics.',
      'Break down complex technical concepts clearly.',
    ],
    traits: [
      'Strong leadership and presence.',
      'Clear, confident communicator.',
      'Technically proficient and experienced.'
    ],
    emoji: '🧑‍🏫',
  },
  'Lab Mentor': {
    responsibilities: [
      'Provide one-on-one student support.',
      'Help debug code and explain logic.',
      'Encourage and guide struggling learners.',
    ],
    traits: [
      'Patient and empathetic.',
      'Excellent at troubleshooting.',
      'Encouraging and supportive mentor.'
    ],
    emoji: '🧪',
  },
  'Campus Director': {
    responsibilities: [
        'Drive student enrollment and meet campus growth targets.',
        'Hire, train, and manage all campus staff, including instructors.',
        'Build and maintain partnerships with local schools and businesses.',
        'Oversee daily campus operations, including scheduling and finances.',
    ],
    traits: [
        'Results-oriented with strong sales and business acumen.',
        'Excellent relationship-builder and charismatic networker.',
        'Highly organized with strong operational management skills.',
    ],
    emoji: '🏢',
  }
};

export default function InterviewConfirmation({ formData, score, reasoning }) {
    // Destructured formData without 'location'
    let { firstName, lastName, email, phone, age, position } = formData;

    useEffect(() => {
        // Determine recommendation level based on score
        let recommendation = 'Not Recommended';
        if (score >= 95) recommendation = 'Perfect Match';
        else if (score >= 85) recommendation = 'Highly Recommended';
        else if (score >= 60) recommendation = 'Somewhat Recommended';

        // Prepare the data payload without 'location'
        const interviewPayload = {
            firstName,
            lastName,
            email,
            phone,
            age,
            position,
            score,
            reasoning,
            recommendation
        };

        // Structure the payload consistently for the parent window
        const structuredSender = {
            event: 'interviewComplete',
            payload: interviewPayload
        };

        console.log(structuredSender); 

        // Send the data to the parent window
        window.parent.postMessage({ structuredSender }, '*');

    }, [formData, score, reasoning]); // Effect dependencies

    const role = roleDescriptions[position];

    return (
        <div className={styles.confirmationContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>🎉 Congratulations, {firstName}!</h2>
                {/* Updated paragraph without location */}
                <p>You have completed your interview for the <strong>{position}</strong> position.</p>
            </div>

            {role && (
                <div className={styles.detailsGrid}>
                    <div>
                        <h3 className={styles.subtitle}>{role.emoji} Role Responsibilities:</h3>
                        <ul className={styles.recommendationList}>
                            {role.responsibilities.map((item, i) => (
                                <li key={i} className={styles.recommendationItem}>✅ {item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className={styles.subtitle}>What We Are Looking For:</h3>
                        <ul className={styles.recommendationList}>
                            {role.traits.map((item, i) => (
                                <li key={i} className={styles.recommendationItem}>🌟 {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className={styles.nextSteps}>
                <p>✅ Your responses have been successfully submitted.</p>
            </div>
        </div>
    );
}