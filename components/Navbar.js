import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { FiLogOut } from "react-icons/fi";
import { IconContext } from "react-icons";
import styles from "../styles/Home.module.css";

export default function NavBar() {
    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
            });
    };

    return (
        <div>
            <IconContext.Provider value={{ size: "1em" }}>
                <button className={styles.btnLogOut} onClick={handleSignOut}>
                    <FiLogOut /> Log out{" "}
                </button>
            </IconContext.Provider>
        </div>
    );
}
