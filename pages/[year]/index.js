import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import TotalBar from "../../components/TotalBar";
import DateCheck from "../../components/MonthCheck";
import DropDown from "../../components/DropDown";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useState, useEffect } from "react";
import { findTotal } from "../../helpers/findTotal";

export default function Home({ setMonth, month }) {
    const [spends, setSpends] = useState([]);
    const [topicTotal, setTopicTotals] = useState({
        food: 0,
        misc: 0,
        "direct-debits": 0,
    });

    const router = useRouter();
    const { year } = router.query;

    useEffect(() => {
        getCategories().then((topics) => {
            // if (topics.length === 0) topics = ["direct-debits", "food", "misc"];

            topics.forEach((topic) => {
                findTotal(topic, year).then((res) => {
                    setTopicTotals((prevState) => {
                        return { ...prevState, [topic]: res };
                    });
                });
            });
        });
    }, [year]);

    const getCategories = async () => {
        const collectionRef = `username/jon/${year}`;
        const querySnapshot = await getDocs(collection(db, collectionRef));

        const result = querySnapshot.docs.map((doc) => {
            return doc.id;
        });
        if (result.length === 0) result = ["direct-debits", "food", "misc"];
        setSpends(result);
        return result;
    };

    return (
        <div className={styles.container}>
            <h1>Expenses Tracker</h1>
            <DropDown month={month} setMonth={setMonth} />
            <DateCheck>
                <TotalBar total={topicTotal} />
                <SpendTopicContainer spends={spends} topicTotal={topicTotal} />
            </DateCheck>
        </div>
    );
}

function SpendTopicContainer({ spends, topicTotal }) {
    return (
        <main>
            <TopicDisplay spends={spends} topicTotal={topicTotal} />
        </main>
    );
}

function TopicDisplay({ spends, topicTotal }) {
    const router = useRouter();
    const { year } = router.query;

    const handleNavigation = (cat) => {
        router.push(`${year}/category/${cat}`);
    };

    return spends.map((item) => {
        return (
            <div key={item} className={`${styles.row} ${styles.card}`}>
                <h2 className={styles.col}>{item}</h2>
                <p className={styles.col}>
                    Spend this month: £{topicTotal[item]}
                </p>
                <button
                    onClick={() => handleNavigation(item)}
                    className={`${styles.col} ${styles.button}`}
                >
                    Add +
                </button>
            </div>
        );
    });
}
