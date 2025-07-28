'use client'
import beltData from '@/data/belt_data.json';
import { useState, useEffect } from 'react'
import styles from "./Recommendation.module.css";
import { getCanonicalBeltKey } from '@/lib/utils';

export default function Recommendation({ recommendation, retakeAssessment }) {
  // Destructure the recommendation object for easier access
  const [showForm, setShowForm] = useState(true);
  
  // State variables for form inputs
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState(10); // Changed to string for input type="number" to handle empty initial state
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  const canonicalKey = getCanonicalBeltKey(recommendation.recommendation);
  const data = canonicalKey ? beltData[canonicalKey] : null;

  //Call retakeAssessment(true) to enable the Retake Assessment button
  useEffect(() => {
    // This code now runs *after* the component renders
    if (data) {
      retakeAssessment(true);
    }
  }, [data, retakeAssessment]);

  if (!data) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use the state variables directly
    const belt_level = recommendation.recommendation;
    const summary = recommendation.summary; // Renamed from recommendationSummary to match target object
    const score = recommendation.score; // Renamed from recommendationScore to match target object

    const timestamp = new Date().toISOString();

    const formData = {
      student_name: studentName,
      student_age: studentAge, // student_age is already a string from input or will be converted by backend if needed
      belt_level,
      score,
      summary,
      timestamp,
      parent_name: parentName,
      parent_email: parentEmail,
      parent_phone: parentPhone,
    };

    const structuredSender = {
      event: 'assessmentComplete',
      payload: formData
    }

    console.log(structuredSender); 

    window.parent.postMessage({
      structuredSender
    }, '*')

    setShowForm(false);
  };

  return (
    <>
      {showForm && (
        <div className={styles.overlay}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className='header-title'>Enter your details to unlock Codie’s recommendation</h3>
            <div className={`input-container`}>
              <label htmlFor="student_name">Student Name</label>
              <input
                type="text"
                id="student_name"
                name="student_name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
            </div>
            <div className={`input-container`}>
              <label htmlFor="student_age">Student Age</label>
              <input
                type="number"
                id="student_age"
                name="student_age"
                value={studentAge}
                onChange={(e) => setStudentAge(e.target.value)}
                required
                min={4}
                max={18}
              />
            </div>
            <div className={`input-container`}>
              <label htmlFor="parent_name">Parent Name</label>
              <input
                type="text"
                id="parent_name"
                name="parent_name"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required
              />
            </div>
            <div className={`input-container`}>
              <label htmlFor="parent_email">Parent Email</label>
              <input
                type="email"
                id="parent_email"
                name="parent_email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                required
              />
            </div>
            <div className={`input-container`}>
              <label htmlFor="parent_phone">Parent Phone</label>
              <input
                type="tel"
                id="parent_phone"
                name="parent_phone"
                value={parentPhone}
                onChange={e => {
                  const cleanedValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setParentPhone(cleanedValue);
                }}
                required
                inputMode="numeric"
                pattern="\d{10}"
                maxLength={10}
              />
            </div>
            <button type="submit" className={`${styles.formBtn} btn primary-button`}>
              Submit
            </button>
          </form>
        </div>
      )}
      <div className={`${styles.recommendationContainer} ${showForm ? styles.blurred : ''}`}>
        {data.icon && (
          <img
            src={data.icon}
            alt={`${data.title} icon`}
            className={styles.beltIcon}
          />
        )}
        <div className={styles.header}>
          <h2 className={styles.title}>{"Codie's Recommendation!"}</h2>
        </div>

        <div className={styles.beltRecommendation}>
          <span className={styles.beltLabel}>{data.title}:</span>
          <span className={styles.beltSubtitle}><i>{data.subtitle}</i></span>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.strengths}>
            <h3 className={styles.subtitle}>{"In this belt you will:"}</h3>
            <ul>
              {data.inThisBelt?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.areasForImprovement}>
            <h3 className={styles.subtitle}>Key outcomes of {data.title}:</h3>
            <ul>
              {data.keyOutcomes?.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.concepts}>
            <h3 className={styles.subtitle}>{"Key Concepts:"}</h3>
            <ul>
              {data.keyConcepts?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sprints}>
            <h3 className={styles.subtitle}>Sprints:</h3>
            <ul>
              {data.sprints?.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.nextSteps}>
          <h3 className={styles.subtitle}>{"Recommendations to Prepare:"}</h3>
          <ul className={styles.recommendationList}>
            {data.recommendations?.map((recommendation, index) => (
              <li key={index} className={styles.recommendationItem}>
                <a href={recommendation.url} target="_blank" rel="noopener noreferrer" className={styles.recommendationLink}>
                  {recommendation.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}