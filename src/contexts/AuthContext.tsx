import React, { useEffect, useState, useContext } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { getAuth, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

export const AuthContext = React.createContext<FirebaseUser | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  function loginWithGithub() {
    setLoading(true);
    signInWithPopup(auth, new GithubAuthProvider());
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: FirebaseUser) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
