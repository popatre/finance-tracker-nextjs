import Head from "next/head";
import { signInGoogle } from "../api/dbCalls";
import styles from "../styles/Home.module.css";
import DropDown from "../components/DropDown";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons";
import Metatags from "../components/Metatags";
import metaImage from "../public/metaimage.png";

export default function Home({ setMonth, month }) {
    const user = useContext(UserContext);

    const handleSignIn = async () => {
        try {
            const result = await signInGoogle();
            console.log(result);
        } catch (error) {
            const errorMessage = error.message;
            console.log(errorMessage);
        }
    };

    return (
        <div className={styles.container__flex}>
            <Metatags
                title="Finance Tracker"
                description="Lightweight, manual finance tracker to help you keep track of your spending"
                image={metaImage}
            />
            <div className={styles.container}>
                <h1 className={styles.title}>Expenses Tracker</h1>
                {!user ? (
                    <div>
                        <button
                            className={styles.btnSignIn}
                            onClick={handleSignIn}
                        >
                            <IconContext.Provider value={{ size: "1.2em" }}>
                                <FcGoogle /> Sign in with Google
                            </IconContext.Provider>
                        </button>
                    </div>
                ) : (
                    <div>
                        <DropDown setMonth={setMonth} month={month} />
                        <p className={styles.welcomeMsg}>
                            Hello {user.displayName}!
                        </p>
                        <p className={styles.welcomeMsg}>
                            {" "}
                            Choose a month to begin
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
