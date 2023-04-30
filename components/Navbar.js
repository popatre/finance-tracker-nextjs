import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { FiLogOut } from "react-icons/fi";
import { IconContext } from "react-icons";
import styles from "../styles/Navbar.module.css";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { IoArrowBackCircle } from "react-icons/io5";
import { useRouter } from "next/router";

export default function NavBar() {
    const user = useContext(UserContext);
    const router = useRouter();
    const { year } = router.query;

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                window.location.reload();
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
            });
    };

    function handleGoBack() {
        router.back();
    }

    const style = {
        visibility: "hidden",
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <div className={styles.nav__contents}>
                    <IoArrowBackCircle
                        onClick={handleGoBack}
                        className={styles.back}
                        size={30}
                        color="#FFFFFF"
                        style={!year ? style : null}
                    />

                    <p className={styles.nav__email}>
                        {user?.email.length <= 20
                            ? user?.email
                            : user?.email.slice(0, 20) + "..."}{" "}
                    </p>
                    <IconContext.Provider value={{ size: "1em" }}>
                        <button
                            className={styles.btnLogOut}
                            onClick={handleSignOut}
                        >
                            <FiLogOut /> Log out{" "}
                        </button>
                    </IconContext.Provider>
                </div>
            </div>
        </nav>
    );
}
