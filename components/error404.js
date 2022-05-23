import styles from "../styles/Error404.module.css";

export default function Page404({ code, message }) {
    return (
        <div className={styles.container}>
            <h1>
                {" "}
                {code} - {message}{" "}
            </h1>
        </div>
    );
}
