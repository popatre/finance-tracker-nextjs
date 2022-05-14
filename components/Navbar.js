import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { FiLogOut } from "react-icons/fi";
import { IconContext } from "react-icons";
import styles from "../styles/Navbar.module.css";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function NavBar() {
    const user = useContext(UserContext);
    console.log(user?.email, "<-----");
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
        <nav className={styles.nav}>
            <p className={styles.nav__email}>
                Viewing spends for: {user?.email}{" "}
            </p>
            <IconContext.Provider value={{ size: "1em" }}>
                <button className={styles.btnLogOut} onClick={handleSignOut}>
                    <FiLogOut /> Log out{" "}
                </button>
            </IconContext.Provider>
        </nav>
    );
}
