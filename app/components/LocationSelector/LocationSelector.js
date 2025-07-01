'use client'
import styles from "./LocationSelector.module.css";

export default function LocationSelector({ askName, onLocationSelected }) {
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const zipcode = formData.get('zipcode');

        const firstName = formData.get('first-name') || null;
        const lastName = formData.get('last-name') || null;

        if (zipcode) {
            onLocationSelected(zipcode); 
        }

        if (firstName) {
            sessionStorage.setItem('firstName', firstName);
        }

        if (lastName) {
            sessionStorage.setItem('lastName', lastName);
        }

        console.log("Session Storage Updated:", {
            location: zipcode,
            firstName: firstName,
            lastName: lastName,
        });
    }

    return (
        <div className={styles.overlay}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className='header-title'>Help us <i>personalize</i> your experience</h3>

                {/* These fields will only appear if the 'askName' prop is true */}
                {askName && (
                    <div className={`input-container`}>
                        <label htmlFor="first-name">First Name</label>
                        <input type="text" id="first-name" name="first-name" required placeholder="Enter your first name" />
                    </div>
                )}
                {askName && (
                    <div className={`input-container`}>
                        <label htmlFor="last-name">Last Name</label>
                        <input type="text" id="last-name" name="last-name" required placeholder="Enter your last name" />
                    </div>
                )}

                <div className={`input-container`}>
                    <label htmlFor="zipcode">Zipcode</label>
                    <input type="text" id="zipcode" name="zipcode" required placeholder="Enter Zipcode" />
                </div>

                <button type="submit" className={`${styles.formBtn} btn primary-button`}>
                    Select
                </button>
            </form>
        </div>
    );
}