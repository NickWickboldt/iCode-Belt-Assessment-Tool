'use client'
import styles from "./Recommendation.module.css";

export default function Recommendation({ recommendation }) {
  // Destructure the recommendation object for easier access
  const { belt, description, strengths, areasForImprovement, nextSteps } = recommendation;

  return (
    <div className={styles.recommendationContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your iCode Program Recommendation</h2>
      </div>

      <div className={styles.beltRecommendation}>
        <span className={styles.beltLabel}>Recommended Belt: {recommendation}</span>
        <span className={styles[`belt_${belt?.toLowerCase().replace(/\s+/g, '')}`]}>{belt}</span>
      </div>

      <p className={styles.description}>{description}</p>

      <div className={styles.detailsGrid}>
        <div className={styles.strengths}>
          <h3 className={styles.subtitle}>In this belt you will:</h3>
          <ul>
            {strengths?.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        <div className={styles.areasForImprovement}>
          <h3 className={styles.subtitle}>Key outcomes of {recommendation}:</h3>
          <ul>
            {areasForImprovement?.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.nextSteps}>
        <h3 className={styles.subtitle}>Recommendations to prepare:</h3>
        <p>{nextSteps}</p>
      </div>
      <div className={styles.learnMoreContainer}>
            <button className="btn primary-button">
                Learn More
            </button>
      </div>
    </div>
  );
}