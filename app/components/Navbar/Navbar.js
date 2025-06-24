'use client'
import Image from 'next/image'; 
import styles from "./Navbar.module.css";
import Link from 'next/link'; 

export default function Navbar() {

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo on the far left */}
        <div className={styles.logoContainer}>
          <Link href="/" passHref>
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
          <button className={`${styles.navButton} ${styles.accessibilityButton}`}>
            Toggle Chatlog
          </button>
          <button className={`${styles.navButton} primary-button`}>
            Legacy Assessment
          </button>
        </div>
      </div>
    </nav>
  );
}