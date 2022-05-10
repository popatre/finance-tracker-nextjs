import Head from "next/head";

import styles from "../styles/Home.module.css";
import DropDown from "../components/DropDown";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function Home({ setMonth, month }) {
    const user = useContext(UserContext);
    console.log(user, "<---");

    return (
        <div className={styles.container}>
            <h1>Expenses Tracker</h1>
            {!user ? (
                <div>
                    <p>Sign in to start</p>
                    <button>Sign in</button>
                </div>
            ) : (
                <DropDown setMonth={setMonth} month={month} />
            )}
        </div>
    );
}
