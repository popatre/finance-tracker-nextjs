import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "../styles/TotalBar.module.css";

export default function TotalBar({ total }) {
    const totalValues = Object.values(total).reduce((a, b) => +a + +b);

    const percentage = ((totalValues / 1600) * 100).toFixed(1);
    return typeof total !== "object" ? (
        <h2>Total spent:£{total}</h2>
    ) : (
        <div className={styles.container}>
            <CircularProgressbar
                styles={buildStyles({
                    // Text size
                    textSize: "20px",

                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 2.9,

                    // Colors
                    // pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                    textColor: "rgba(380, 200, 100, 10.939)",
                    trailColor: "#d6d6d6",
                    // backgroundColor: "white",
                })}
                value={percentage}
                text={`${percentage}%`}
            />
            <h2>Total spent:£{totalValues.toFixed(2)}</h2>
        </div>
    );
}
