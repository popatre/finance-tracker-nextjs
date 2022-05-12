import { auth, provider } from "../firebase/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import {
    collection,
    getDocs,
    serverTimestamp,
    doc,
    deleteDoc,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const signInGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    return result.user;
};

export const getCategories = async (user, year) => {
    const collectionRef = `username/${user?.email}/${year}`;
    console.log(collectionRef, user);
    const querySnapshot = await getDocs(collection(db, collectionRef));

    const result = querySnapshot.docs.map((doc) => {
        return doc.id;
    });
    if (result.length === 0) result = ["direct-debits", "food", "misc"];

    return result;
};

export const getSpend = async (user, year, spend) => {
    const collectionPath = `username/${user?.email}/${year}/${spend}/spend`;
    const collectionRef = collection(db, collectionPath);
    const dbQuery = query(collectionRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(dbQuery);

    const result = querySnapshot.docs.map((doc) => {
        return doc.data();
    });
    return result;
};
