import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase/firebase";

const findTotal = async (spend, month, user, year) => {
    const collectionRef = `username/${user}/year/${year}/${month}/${spend}/spend`;

    const querySnapshot = await getDocs(collection(db, collectionRef));

    const result = querySnapshot.docs.map((doc) => {
        return doc.data();
    });

    const total = result.reduce((acc, curr) => {
        return acc + +curr.spend;
    }, 0);
    return total.toFixed(2);
};

export { findTotal };
