import styles from "./AssessmentForm.module.css";



export default function AssessmentForm() {


    return (
        <div className={`${styles.container} div-container`}>
            <div className="input-container">
                <label htmlFor="name">Email</label>
                <input type="email" name="email" placeholder="Email" />
            </div>
            <div className="input-container">
                <label htmlFor="phone">Phone</label>
                <input type="phone" name="phone" placeholder="Phone" />
            </div>
            <button className={`btn primary-button`}>Start Assessment</button>
        </div>
    )
}