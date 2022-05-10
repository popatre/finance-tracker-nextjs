import { signInGoogle } from "../api/dbCalls";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import styles from "../styles/Home.module.css";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons";

export default function AuthCheck({ children }) {
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

    return !user ? (
        <div>
            <p className={styles.signInWarning}>
                You must be signed in to view pages
            </p>
            <button className={styles.btnSignIn} onClick={handleSignIn}>
                <IconContext.Provider value={{ size: "1.2em" }}>
                    <FcGoogle /> Sign in with Google
                </IconContext.Provider>
            </button>
        </div>
    ) : (
        children
    );
}
