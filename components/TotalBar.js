import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getCurrentIncome } from "../api/dbCalls";
import styles from "../styles/TotalBar.module.css";

export default function TotalBar({ total, user, month, incomeUpdated }) {
    const [income, setIncome] = useState(1000);
    console.log(total, "****");
    useEffect(() => {
        getCurrentIncome(user, month).then((result) => {
            setIncome(result?.income);
        });
    }, [incomeUpdated, user, month]);

    const totalValues = Object.values(total).reduce((a, b) => +a + +b);

    const percentage = +((totalValues / +income) * 100).toFixed(1);

    let displayMessage = "";
    if (percentage === Infinity || isNaN(percentage))
        displayMessage = "No income";
    else displayMessage = percentage + "%";
    return typeof total !== "object" ? (
        <h2 className={styles.spendH2}>Total spent:£{total}</h2>
    ) : (
        <div className={styles.container}>
            <CircularProgressbar
                styles={buildStyles({
                    // Text size
                    textSize: "15px",

                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 2.9,

                    // Colors
                    pathColor: `rgba(64, 166, 98, 0.8)`,
                    textColor: "rgba(380, 200, 100, 10.939)",
                    trailColor: "#d6d6d6",
                    // backgroundColor: "white",
                })}
                value={percentage}
                text={`${displayMessage}`}
            />
            <h2 className={styles.totalDisplay}>
                Total spent:£{totalValues.toFixed(2)}
            </h2>
        </div>
    );
}
