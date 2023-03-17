import { doc, getDoc, setDoc } from "@firebase/firestore";
import { createCollection } from "../firebase.js";
import { User as FirebaseUser } from "firebase/auth";
import { IUser } from "../types/User";

const usersCollection = createCollection<IUser>("users");

export async function createUser(firebaseUser: FirebaseUser): Promise<IUser | null> {
  const newUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
  };
  await setUser(newUser.uid, newUser);
  const user = await getUser(newUser.uid);
  return user ? user : null;
}

export async function getUser(id: string): Promise<IUser | null> {
  const userDocRef = doc(usersCollection, id);
  const userDoc = await getDoc(userDocRef);
  const userData = userDoc.data();
  return userData ? userData : null;
}

export async function setUser(id: string, user: IUser): Promise<void> {
  const userDocRef = doc(usersCollection, id);
  await setDoc(userDocRef, user);
}
