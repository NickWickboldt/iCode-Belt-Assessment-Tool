'use client'
import styles from "./LocationSelector.module.css";

export default function LocationSelector({ askName, onLocationSelected }) {
    const handleSubmit = async (e) => {
        // 1. Prevent the page from reloading on form submission
        e.preventDefault();

        // 2. Create a FormData object from the form element that was submitted
        const formData = new FormData(e.target);

        // 3. Get the values from each input field using their 'name' attribute
        const zipcode = formData.get('zipcode');
        const firstName = formData.get('first-name');
        const lastName = formData.get('last-name');

        // 4. Set the values in sessionStorage
        // The 'location' key will be set to the value of the 'zipcode' input
        if (zipcode) {
            sessionStorage.setItem('location', zipcode);
            onLocationSelected(zipcode); // Call the callback to update parent state
        }

        // The name fields are conditional, so we only set them if they exist.
        // The 'firstName' key will be set to the value of the 'first-name' input
        if (firstName) {
            sessionStorage.setItem('firstName', firstName);
        }

        // The 'lastName' key will be set to the value of the 'last-name' input
        if (lastName) {
            sessionStorage.setItem('lastName', lastName);
        }

        // Optional: Log to the console to confirm that the data was saved
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