import "../styles/globals.css";
import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import AuthContextProvider from "../contexts/AuthProvider";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
    const [month, setMonth] = useState("");

    return (
        <AuthContextProvider>
            <NavBar />
            <Component setMonth={setMonth} month={month} {...pageProps} />;
            <Toaster />
        </AuthContextProvider>
    );
}

export default MyApp;
