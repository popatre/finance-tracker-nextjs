import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import TotalBar from "../../components/TotalBar";
import Link from "next/link";
import AuthCheck from "../../components/AuthCheck";
import DropDown from "../../components/DropDown";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getCategories } from "../../api/dbCalls";
import { useState, useEffect, useContext } from "react";
import { findTotal } from "../../helpers/findTotal";
import { UserContext } from "../../contexts/UserContext";

export default function Home({ setMonth, month }) {
    const [spends, setSpends] = useState([]);
    const [topicTotal, setTopicTotals] = useState({
        food: 0,
        misc: 0,
        "direct-debits": 0,
    });

    const user = useContext(UserContext);

    const router = useRouter();
    const { year } = router.query;

    useEffect(() => {
        getCategories(user, year).then((topics) => {
            setSpends(topics);
            topics.forEach((topic) => {
                findTotal(topic, year, user?.email).then((res) => {
                    setTopicTotals((prevState) => {
                        return { ...prevState, [topic]: res };
                    });
                });
            });
        });
    }, [year, user]);

    return (
        <div className={styles.container}>
            <h1>Expenses Tracker</h1>
            <AuthCheck>
                <DropDown month={month} setMonth={setMonth} />
                <TotalBar total={topicTotal} />
                <SpendTopicContainer spends={spends} topicTotal={topicTotal} />
            </AuthCheck>
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

    return spends.map((item) => {
        return (
            <Link href={`${year}/category/${item}`}>
                <div key={item} className={`${styles.row} ${styles.card}`}>
                    <h2 className={styles.col}>{item}</h2>
                    <p className={styles.col}>
                        Spent this month: £{topicTotal[item]}
                    </p>
                </div>
            </Link>
        );
    });
}
