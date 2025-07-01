'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./Login.module.css";
import BeltSelector from '../BeltSelector/BeltSelector';

// --- Helper Component: GoogleSignInButton (no changes needed here) ---
function GoogleSignInButton({ onSignIn }) {
  const googleButton = useRef(null);
  useEffect(() => {
    if (window.google && googleButton.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: onSignIn,
      });
      window.google.accounts.id.renderButton(
        googleButton.current,
        { theme: 'outline', size: 'large', type: 'standard', shape: 'rectangular', text: 'signin_with', logo_alignment: 'left' }
      );
    }
  }, [onSignIn]);
  return <div ref={googleButton}></div>;
}



// --- Main Component ---
export default function LoginModal({ addMessage }) {
  const router = useRouter();
  // Use a state to manage the authentication status
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading', 'authenticated', 'unauthenticated'
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const storedToken = localStorage.getItem('userToken');

      if (!storedToken) {
        setAuthStatus('unauthenticated');
        return;
      }

      try {
        // Ask the server to verify the token by calling our new API route
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setAuthStatus('authenticated');
        } else {
          // If the token is invalid, the server will respond with an error
          localStorage.removeItem('userToken'); // Clean up the bad token
          setAuthStatus('unauthenticated');
        }
      } catch (error) {
        console.error("Failed to check user status", error);
        setAuthStatus('unauthenticated');
      }
    };

    checkUserStatus();
  }, []); // Run only once on component mount

  const handleCredentialResponse = async (response) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('userToken', data.token);
      sessionStorage.setItem('email', data.user['email'])
      setUser(data.user);
      setAuthStatus('authenticated');
      // Optional: Redirect after successful login
      // router.push('/instructor-page');
    } else {
      // Handle login failure...
    }
  };

  // --- Render logic based on the authStatus state ---

  if (authStatus === 'loading') {
    return (
      <div className={`${styles.container} div-container`}>
        <p>Loading...</p> {/* Or a spinner component */}
      </div>
    );
  }

  return authStatus === 'authenticated' ? (
    <div className={styles.centerContainer}>
      <BeltSelector addMessage={addMessage} />
    </div>
  ) : (
    <div className={`${styles.container} div-container`}>
      <h1>Sign In</h1>
      <GoogleSignInButton onSignIn={handleCredentialResponse} />
      <p id="authMessage">Please sign in with Google</p>
    </div>
  );
}