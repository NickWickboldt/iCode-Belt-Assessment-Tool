'use client'
import styles from "./LocationSelector.module.css";

export default function LocationSelector() {
    const handleSubmit = async (e) => {
        e.preventDefault()

    }

    return (
        <div className={styles.overlay}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className='header-title'>Help us <i>personalize</i> your experience</h3>

                <div className={`input-container`}>
                    <label>Zipcode</label>
                    <input type="text" id="name" name="name" required placeholder="Enter Zipcode"/>
                </div>

                <button type="submit" className={`${styles.formBtn} btn primary-button`}>
                    Select
                </button>
            </form>
        </div>
    );
}
