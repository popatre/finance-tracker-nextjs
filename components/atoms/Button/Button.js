import styles from "./Button.module.css";

export default function Button({ onClick, label }) {
    return (
        <button className={styles.btn__gold} onClick={onClick}>
            {label}
        </button>
    );
}
