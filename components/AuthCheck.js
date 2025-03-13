import { signInGoogle } from "../api/dbCalls";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import styles from "../styles/Home.module.css";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons";
const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS || [];

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

    console.log({ allowedEmails, user });
    const email = user?.email;

    if (!user) {
        return (
            <div>
                <p className={styles.signInWarning}>
                    You must be signed in to view pages
                </p>
                <div className={styles.errorContainer}>
                    <button className={styles.btnSignIn} onClick={handleSignIn}>
                        <IconContext.Provider value={{ size: "1.2em" }}>
                            <FcGoogle /> Sign in with Google
                        </IconContext.Provider>
                    </button>
                </div>
            </div>
        );
    }

    if (email) {
        const isAllowedEmail = allowedEmails.split(" ").includes(user?.email);
        if (!isAllowedEmail) {
            return (
                <div className={styles.card} style={{ margin: "2em" }}>
                    <p>Hello {user?.displayName}</p>
                    <p>Thanks for stopping by!</p>
                    <p style={{ marginBlock: "1em" }}>
                        I have had to limit the users due to a random spike in
                        people viewing this. (its on a free tier)
                    </p>
                    <p>
                        If you are really in need of a finance tracker, send me
                        an email
                    </p>
                </div>
            );
        }
    }

    return children;
}
