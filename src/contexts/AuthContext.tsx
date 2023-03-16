import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GithubAuthProvider,
} from 'firebase/auth';

import { auth } from '../firebase';

type AuthContextType = {
  currentUser: FirebaseUser | null;
  signInWithGithub: () => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  function signInWithGithub() {
    setLoading(true);
    signInWithPopup(auth, new GithubAuthProvider());
    // .then((result) => {
    //   // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    //   const credential = GithubAuthProvider.credentialFromResult(result);
    //   const token = credential?.accessToken;
    // });
  }

  function signOut() {
    auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      setCurrentUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    signInWithGithub,
    signOut,
  };

  return (
    <AuthContext.Provider value={{ currentUser, signInWithGithub, signOut }}>
      {/* {!loading && children} */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}
