import "../styles/globals.css";
import { useState, useEffect } from "react";

import AuthContextProvider from "../contexts/AuthProvider";

function MyApp({ Component, pageProps }) {
    const [month, setMonth] = useState("");

    return (
        <AuthContextProvider>
            <Component setMonth={setMonth} month={month} {...pageProps} />;
        </AuthContextProvider>
    );
}

export default MyApp;
