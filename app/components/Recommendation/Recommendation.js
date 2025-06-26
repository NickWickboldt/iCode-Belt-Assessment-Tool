'use client'
import beltData from '@/data/belt_data.json';
import { useState, useEffect } from 'react'
import styles from "./Recommendation.module.css";
import { getCanonicalBeltKey } from '@/lib/utils';

export default function Recommendation({ recommendation, retakeAssessment }) {
  // Destructure the recommendation object for easier access
  const [showForm, setShowForm] = useState(true)
  const canonicalKey = getCanonicalBeltKey(recommendation);
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // you could also grab form values here…
    setShowForm(false)
  }

  return (
    <>
      {showForm && (
        <div className={styles.overlay}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className='header-title'>Enter your details to unlock Codie’s recommendation</h3>
            <div className={`input-container`}>
              <label>Name</label>
              <input type="text" required />
            </div>
            <div className={`input-container`}>
              <label>Email</label>
              <input type="email" required />
            </div>
            <div className={`input-container`}>
              <label>Phone</label>
              <input type="tel" required />
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