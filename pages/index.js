import Head from "next/head";
import { signInGoogle } from "../api/dbCalls";
import styles from "../styles/Home.module.css";
import DropDown from "../components/DropDown";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons";
import Metatags from "../components/Metatags";
import YearDropDown from "../components/YearDropDown";

export default function Home({ setMonth, month, setYear, year }) {
    const user = useContext(UserContext);

    const handleSignIn = async () => {
        try {
            const result = await signInGoogle();
        } catch (error) {
            const errorMessage = error.message;
        }
    };

    return (
        <section>
            <div className={styles.container__flex}>
                <Metatags
                    title="Finance Tracker"
                    description="Lightweight, manual finance tracker to help you keep track of your spending"
                    image={""}
                />
                <div className={styles.container}>
                    <h1 className={styles.title}>Finance Tracker</h1>
                    {!user ? (
                        <div className={styles.btnBox}>
                            <button
                                className={styles.btnSignIn}
                                onClick={handleSignIn}
                            >
                                <IconContext.Provider value={{ size: "1.8em" }}>
                                    <FcGoogle className={styles.btnIcon} /> Sign
                                    in with Google
                                </IconContext.Provider>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <YearDropDown setYear={setYear} year={year} />
                            {year && <DropDown setMonth={setMonth} />}
                            <p className={styles.welcomeMsg}>
                                Hello {user.displayName}!
                            </p>
                            <p className={styles.welcomeMsg}>
                                {" "}
                                Choose a year to begin
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <footer>
                <p>
                    <a href="https://jonmcg.co.uk">Jonathan McGuire</a> 2023
                    &copy;
                </p>
            </footer>
        </section>
    );
}
