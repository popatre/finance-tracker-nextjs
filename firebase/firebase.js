// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain: "money-tracker-a57b9.firebaseapp.com",
    projectId: "money-tracker-a57b9",
    storageBucket: "money-tracker-a57b9.appspot.com",
    messagingSenderId: "953867147498",
    appId: "1:953867147498:web:48fc676993f9a2489f1f93",
    measurementId: "G-9PMEG517YP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
    ignoreUndefinedProperties: true,
    experimentalForceLongPolling: true,
});

//const db = getFirestore(app);
const auth = getAuth();

const provider = new GoogleAuthProvider();

export { app, db, auth, provider };
