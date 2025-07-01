import styles from './ReadinessComplete.module.css'
import { useEffect, useState } from 'react';

export default function ReadinessComplete({ readinessEvaluation, belt }) {

    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe');

    useEffect(() => {
        const sendReadinessEmail = async () => {
            const emailTemplateData = await fetch('/emailTemplates/instructorReadinessTemplate.html');
            let template = await emailTemplateData.text();
            const storedEmail = sessionStorage.getItem('email')|| 'No email was set'
            console.log(storedEmail)
            const storedFirst = sessionStorage.getItem('firstName') || 'John';
            const storedLast = sessionStorage.getItem('lastName') || 'Doe';
            setFirstName(storedFirst);
            setLastName(storedLast);
            const evaluationVars = {
                firstName: storedFirst,
                lastName: storedLast,
                evaluation: readinessEvaluation,
                belt: belt
            };

            for (let key in evaluationVars) {
                const re = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                template = template.replace(re, evaluationVars[key]);
            }

            await fetch('https://nicholaswickboldt.app.n8n.cloud/webhook/instructor-assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailTemplate: template, email: sessionStorage.getItem('email')})
            });
        };

        sendReadinessEmail();
        }, []);
  return (
    <div className={`div-container ${styles.container}`}>
      <h2>Readiness Assessment Complete</h2>
      <p>Thank you, <strong>{firstName} {lastName}</strong>, for completing the readiness assessment!</p>
      <p>{"Here is Codie's determination:"}</p>

      <div className={styles.evaluationBox}>
        <p>{readinessEvaluation}</p>
      </div>

      <div className={styles.recommendations}>
        <h3>Here are some tips for improvement:</h3>
        <ul>
          <li>✅ Review the lesson plan before class.</li>
          <li>🧠 Reflect on any questions you found challenging.</li>
          <li>📚 Revisit key concepts from previous lessons.</li>
          <li>🗣️ Ask a coworker for clarification on tough topics.</li>
        </ul>
      </div>
        <p className={styles.emailP}>
    📩 A summary of your results will be sent to the director for review.
      </p>
    </div>
  );
}
