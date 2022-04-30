import "../styles/globals.css";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
    const [month, setMonth] = useState("");
    return <Component setMonth={setMonth} month={month} {...pageProps} />;
}

export default MyApp;
