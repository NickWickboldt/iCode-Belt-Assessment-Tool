'use client'
import beltData from '@/data/belt_data.json';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react'
import styles from "./Recommendation.module.css";
import { getCanonicalBeltKey } from '@/lib/utils';

export default function Recommendation({ recommendation, retakeAssessment, franchiseLocation }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target

    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const url = window.location.href;

    //use the location to get all the franchise info


    console.log(franchiseLocation)
    const franchiseTemplateData = await fetch('/emailTemplates/franchiseMailTemplate.html');
    let franchiseTemplate = await franchiseTemplateData.text();
    const franchiseEmail = "entbit12@gmail.com"
    const franchiseVars = {
      student_name: name,
      student_phone: phone,
      student_email: email,
      belt_recommendation: data.title,
      recipient_name: "franchise name"
    };

    for (let key in franchiseVars) {
      const re = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      franchiseTemplate = franchiseTemplate.replace(re, franchiseVars[key]);
    }

    const userTemplateData = await fetch('/emailTemplates/userMailTemplate.html');
    let userTemplate = await userTemplateData.text();

    const userVars = {
      student_name: name,
      belt_recommendation: data.title,
      icode_franchise_name: "franchise name",
      icode_franchise_location: "location",
      icode_franchise_phone: "45465466546",
      icode_franchise_email: franchiseEmail
    };

    for (let key in userVars) {
      const re = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      userTemplate = userTemplate.replace(re, userVars[key]);
    }


    try {
      const response = await fetch(
        'https://nicholaswickboldt.app.n8n.cloud/webhook/recieve-emails',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, url, data, franchiseTemplate, userTemplate, franchiseEmail })
        }
      )
      if (!response.ok) {
        console.error('Failed to send data:', response.statusText)
      }
    } catch (err) {
      console.error('Error sending data:', err)
    }
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
              <input type="text" id="name" name="name" required />
            </div>
            <div className={`input-container`}>
              <label>Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className={`input-container`}>
              <label>Phone</label>
              <input
                type="tel" id="phone" name="phone" required inputMode="numeric" pattern="\d{10}" maxLength={10}
                onInput={e => {
                  e.currentTarget.value = e.currentTarget.value
                    .replace(/\D/g, '')
                    .slice(0, 10);
                }}
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