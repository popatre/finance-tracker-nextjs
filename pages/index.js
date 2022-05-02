import Head from "next/head";

import styles from "../styles/Home.module.css";
import DropDown from "../components/DropDown";
import { useState } from "react";

export default function Home({ setMonth, month }) {
    const [spends, setSpends] = useState([
        { cat: "food", total: 100 },
        { cat: "utils", total: 10 },
        { cat: "direct-debits", total: 200 },
    ]);

    return (
        <div className={styles.main}>
            <h1>Expenses Tracker</h1>
            <DropDown setMonth={setMonth} month={month} />
        </div>
    );
}
