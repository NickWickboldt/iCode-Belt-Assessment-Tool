'use client'

import { useEffect, useState } from 'react';
import styles from './InterviewResult.module.css'; // optional: for styling

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
    }
};

export default function InterviewConfirmation({ formData, score, reasoning }) {
    const [emailsSent, setEmailsSent] = useState(false);
    let { firstName, lastName, email, phone, age, location, position } = formData;

    if (/^[a-zA-Z]/.test(location)) {
        location = location.charAt(0).toUpperCase() + location.slice(1);
    }

    useEffect(() => {
        const sendInterviewEmails = async () => {
            const url = window.location.href;

            // Determine recommendation level
            let recommendation = 'Not Recommended';
            if (score >= 95) recommendation = 'Perfect Match';
            else if (score >= 85) recommendation = 'Highly Recommended';
            else if (score >= 60) recommendation = 'Somewhat Recommended';

            // ---- Load & Fill User Template ----
            const userTemplateData = await fetch('/emailTemplates/userInterviewTemplate.html');
            let userTemplate = await userTemplateData.text();

            const userVars = {
                firstName,
                lastName,
                position,
                location
            };

            for (let key in userVars) {
                const re = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                userTemplate = userTemplate.replace(re, userVars[key]);
            }

            // ---- Load & Fill Franchise Template ----
            const franchiseTemplateData = await fetch('/emailTemplates/franchiseInterviewTemplate.html');
            let franchiseTemplate = await franchiseTemplateData.text();

            const franchiseVars = {
                recipient_name: location,
                firstName,
                lastName,
                email,
                phone,
                age,
                location,
                position,
                score: score.toString(),
                reasoning,
                recommendation
            };

            for (let key in franchiseVars) {
                const re = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                franchiseTemplate = franchiseTemplate.replace(re, franchiseVars[key]);
            }

            // ---- Send Email Payload ----
            try {
                const response = await fetch('https://nicholaswickboldt.app.n8n.cloud/webhook-test/interview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: `${firstName} ${lastName}`,
                        email,
                        location,
                        position,
                        score,
                        reasoning,
                        url,
                        userTemplate,
                        franchiseTemplate
                    })
                });

                if (!response.ok) {
                    console.error('Failed to send interview emails:', response.statusText);
                } else {
                    setEmailsSent(true);
                }
            } catch (err) {
                console.error('Error sending interview emails:', err);
            }
        };

        sendInterviewEmails();
    }, []);

    const role = roleDescriptions[position];

    return (
        <div className={styles.confirmationContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>🎉 Congratulations, {firstName}!</h2>
                <p>You have completed your interview for the <strong>{position}</strong> position at our <strong>{location}</strong> location.</p>
                <p>An email confirmation has been sent to <strong>{email}</strong> and the location has been notified.</p>
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
                        <h3 className={styles.subtitle}>What We're Looking For:</h3>
                        <ul className={styles.recommendationList}>
                            {role.traits.map((item, i) => (
                                <li key={i} className={styles.recommendationItem}>🌟 {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {emailsSent && (
                <div className={styles.nextSteps}>
                    <p>✅ Your responses have been successfully submitted. A member of our team will follow up with you shortly!</p>
                </div>
            )}
        </div>
    );
}
