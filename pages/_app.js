import "../styles/globals.css";
import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import AuthContextProvider from "../contexts/AuthProvider";
import { Toaster } from "react-hot-toast";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState(null);
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
    }, []);

    return (
        <AuthContextProvider>
            {user ? <NavBar /> : null}
            <Component
                setMonth={setMonth}
                month={month}
                setYear={setYear}
                year={year}
                {...pageProps}
            />

            <Toaster />
        </AuthContextProvider>
    );
}

export default MyApp;
