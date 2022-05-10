import { auth, provider } from "../firebase/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

export const signInGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    return result.user;
};
