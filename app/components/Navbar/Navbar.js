'use client'
import Image from 'next/image';
import styles from "./Navbar.module.css";
import Link from 'next/link'; 


export default function Navbar({setShowChatLog, retakeAssessment, chatlogIsOpen}) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo on the far left */}
        <div className={styles.logoContainer}>
          <Link href="/" passHref onClick={() => {window.location.reload();}}>
              <Image
                src="/icode-logo.png"
                alt="iCode"
                width={60}
                height={60} 
                priority
              />
          </Link>
        </div>

        {/* Navigation Buttons on the far right */}
        <div className={styles.navLinks}>
          {retakeAssessment && (
            <button className={`${styles.navButton} btn primary-button`} onClick={() => {
              window.location.reload(); 
            }}>
              Take a new Assessment
            </button>
          )}
          <button
            className={`${styles.navButton}  btn ${chatlogIsOpen ? 'primary-button' : `${styles.accessibilityButton}`}`}
            onClick={() => setShowChatLog(prev => !prev)}
          >
            Toggle Chatlog
          </button>
          {/* <button className={`${styles.navButton} primary-button btn`}>
            Legacy Assessment
          </button> */}
        </div>
      </div>
    </nav>
  );
}