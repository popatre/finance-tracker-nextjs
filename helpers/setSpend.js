import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const setSpendInDatabase = async (
    description,
    cost,
    date,
    uid,
    year,
    spend,
    user
) => {
    try {
        const collectionRef = `username/${user}/${year}/${spend}/spend`;
        const docRef = await addDoc(collection(db, collectionRef), {
            description,
            spend: cost,
            date,
            uid,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export { setSpendInDatabase };
