import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

import { IUser } from "../types/User";
import { getUser, createUser } from "../services/UserService";
import { getLocalGithubAccessToken, setLocalGithubAccessToken, clearLocalGithubAccessToken } from "../services/GithubService";

type AuthContextType = {
  currentUser: IUser | null;
  signInWithGithub: () => void;
  signOut: () => void;
  githubAccessToken: string | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  function signInWithGithub() {
    setLoading(true);
    signInWithPopup(auth, new GithubAuthProvider()).then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      if (token) {
        setGithubAccessToken(token);
        setLocalGithubAccessToken(token);
      }
    });
  }

  function signOut() {
    auth.signOut();
    clearLocalGithubAccessToken();
  }

  useEffect(() => {
    const initializeGithubAccessToken = () => {
      const token = getLocalGithubAccessToken();
      setGithubAccessToken(token);
    };

    const unsubscribe = onAuthStateChanged(auth, (fbaseUser) => {
      if (!fbaseUser) {
        setFirebaseUser(null);
        setCurrentUser(null);
        return;
      }

      const getOrCreateUser = async (fbaseUser: FirebaseUser) => {
        let user = await getUser(fbaseUser.uid);
        if (!user) {
          user = await createUser(fbaseUser);
        }
        setCurrentUser(user);
      };

      setFirebaseUser(fbaseUser);
      getOrCreateUser(fbaseUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
      initializeGithubAccessToken();
    };
  }, []);

  const value = {
    currentUser,
    signInWithGithub,
    signOut,
    githubAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* {!loading && children} */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}
