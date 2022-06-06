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
    writeBatch,
    updateDoc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const signInGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    return result.user;
};

export const getCategories = async (user, year) => {
    if (user == null) return [];

    const collectionRef = `username/${user?.email}/${year}`;

    const querySnapshot = await getDocs(collection(db, collectionRef));

    const result = querySnapshot.docs
        .map((doc) => {
            return doc.id;
        })
        .filter((doc) => doc !== "income");

    if (result.length === 0) {
        const batch = writeBatch(db);

        const collectionRef1 = `username/${user?.email}/${year}`;

        const docRef = doc(db, collectionRef1, "food");
        const docRef1 = doc(db, collectionRef1, "misc");
        const docRef2 = doc(db, collectionRef1, "direct-debits");
        const docRef3 = doc(db, collectionRef1, "income");
        batch.set(docRef, {});
        batch.set(docRef1, {});
        batch.set(docRef2, {});
        batch.set(docRef3, { income: 0 });
        await batch.commit();

        result = ["direct-debits", "food", "misc"];
    }

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

export const updateIncome = async (user, year, income) => {
    const collectionRef = `username/${user?.email}/${year}`;
    const docRef = doc(db, collectionRef, "income");

    await updateDoc(docRef, { income: income });
    console.log("updated income");
};

export const getCurrentIncome = async (user, year) => {
    const collectionRef = `username/${user?.email}/${year}`;
    const docRef = doc(db, collectionRef, "income");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        //console.log("No such document!");
    }
};

export const getSpendsInDb = async (user, year, spend) => {
    const collectionRef = `username/${user?.email}/${year}`;
    const docRef = doc(db, collectionRef, `${spend}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return Promise.reject("No such document");
    }
};

export const addNewCategory = async (category, user, year) => {
    const collectionRef = `username/${user?.email}/${year}`;

    await setDoc(doc(db, collectionRef, `${category}`), {});
};

export const deleteCategory = async (category, user, year) => {
    const docRef = `username/${user.email}/${year}`;

    deleteDoc(doc(db, docRef, `${category}`));
};
