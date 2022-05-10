import Head from "next/head";
import { signInGoogle } from "../api/dbCalls";
import styles from "../styles/Home.module.css";
import DropDown from "../components/DropDown";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function Home({ setMonth, month }) {
    const user = useContext(UserContext);

    const handleSignIn = async () => {
        try {
            const result = await signInGoogle();
            console.log(result.email);
        } catch (error) {
            const errorMessage = error.message;
            console.log(errorMessage);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Expenses Tracker</h1>
            {!user ? (
                <div>
                    <p>Sign in to start</p>
                    <button onClick={handleSignIn}>Sign in</button>
                </div>
            ) : (
                <DropDown setMonth={setMonth} month={month} />
            )}
        </div>
    );
}
