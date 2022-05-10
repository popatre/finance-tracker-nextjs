import "../styles/globals.css";
import { useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import AuthContextProvider from "../components/MonthCheck";

function MyApp({ Component, pageProps }) {
    // useEffect(() => {
    //     onAuthStateChanged(auth, (user) => {
    //         setUser(user?.email);
    //     });
    // }, []);

    const [user, setUser] = useState(null);
    const [month, setMonth] = useState("");

    return (
        <AuthContextProvider>
            <Component setMonth={setMonth} month={month} {...pageProps} />;
        </AuthContextProvider>
    );
}

export default MyApp;
