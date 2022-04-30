import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import TotalBar from "../../components/TotalBar";
import DateCheck from "../../components/MonthCheck";
import DropDown from "../../components/DropDown";
import { useState } from "react";

export default function Home({ setMonth, month }) {
    const [spends, setSpends] = useState([
        { cat: "food", total: 100 },
        { cat: "utils", total: 10 },
        { cat: "direct debits", total: 200 },
    ]);

    return (
        <div className={styles.main}>
            <h1>Expenses Tracker</h1>
            <DropDown month={month} setMonth={setMonth} />
            <DateCheck>
                <TotalBar />
                <SpendTopicContainer spends={spends} />
            </DateCheck>
        </div>
    );
}

function SpendTopicContainer({ spends }) {
    return (
        <main>
            <TopicDisplay spends={spends} />
        </main>
    );
}

function TopicDisplay({ spends }) {
    const router = useRouter();
    const { year } = router.query;

    const handleNavigation = (cat) => {
        router.push(`${year}/category/${cat}`);
    };

    return spends.map((item) => {
        return (
            <div key={item.cat} className={styles.row}>
                <h2 className={styles.col}>{item.cat}</h2>
                <p className={styles.col}>{item.total}</p>
                <button
                    onClick={() => handleNavigation(item.cat)}
                    className={styles.col}
                >
                    Add +
                </button>
            </div>
        );
    });
}
