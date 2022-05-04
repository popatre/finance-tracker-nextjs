import { useRouter } from "next/router";
import TotalBar from "../../../components/TotalBar";
import styles from "../../../styles/Home.module.css";
import {
    collection,
    getDocs,
    serverTimestamp,
    doc,
    deleteDoc,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { setSpendInDatabase } from "../../../helpers/setSpend";
import _ from "lodash";

export default function DisplayExpense() {
    const router = useRouter();
    const { spend, year } = router.query;
    const [pastSpend, setPastSpend] = useState([]);

    useEffect(() => {
        getSpend();
    }, [spend]);

    const getSpend = async () => {
        const collectionPath = `username/jon/${year}/${spend}/spend`;
        const collectionRef = collection(db, collectionPath);
        const dbQuery = query(collectionRef, orderBy("date", "desc"));
        const querySnapshot = await getDocs(dbQuery);

        const result = querySnapshot.docs.map((doc) => {
            return doc.data();
        });
        // console.log(result);
        setPastSpend(result);
    };

    const totalSpend = () => {
        const total = pastSpend.reduce((acc, curr) => {
            return acc + +curr.spend;
        }, 0);
        return total.toFixed(2);
    };

    return (
        <main className={styles.container}>
            <h1>{_.capitalize(spend)}</h1>
            <TotalBar total={totalSpend()} />
            <ExpenseAdder
                setPastSpend={setPastSpend}
                year={year}
                spend={spend}
            />
            <SingleExpenseDisplay
                pastSpend={pastSpend}
                year={year}
                spend={spend}
            />
        </main>
    );
}

function ExpenseAdder({ setPastSpend, year, spend }) {
    const [input, setInput] = useState("");
    const [cost, setCost] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const date = serverTimestamp();
        const uid = uuidv4();

        setSpendInDatabase(input, cost, date, uid, year, spend).then(() => {
            setPastSpend((prevValue) => {
                const parsedDate = new Date().getTime() / 1000;
                return [
                    ...prevValue,
                    {
                        description: input,
                        spend: cost,
                        date: { seconds: parsedDate },
                        uid,
                    },
                ];
            });
        });

        setInput("");
        setCost("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="expense">Expense:</label>
            <input
                name="expense"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></input>
            <label htmlFor="cost">Cost:</label>
            <input
                name="cost"
                value={cost}
                type="number"
                onChange={(e) => setCost(e.target.value)}
            ></input>
            <button>Add Expense</button>
        </form>
    );
}

function SingleExpenseDisplay({ pastSpend, year, spend }) {
    const handleDelete = async (document) => {
        const docRef = `username/jon/${year}/${spend}/spend`;
        const collectionRef = collection(db, docRef);

        const dbQuery = query(collectionRef, where("uid", "==", document.uid));
        const querySnapshot = await getDocs(dbQuery);

        querySnapshot.forEach((document) => {
            deleteDoc(doc(db, docRef, document.id));
            /******* add rendering on page **********/
        });
    };

    return (
        <div className={styles.container}>
            {pastSpend.map((item) => {
                return (
                    <div
                        key={item.uid}
                        className={`${styles.row} ${styles.card}`}
                    >
                        <>
                            <p className={styles.col}>
                                {new Date(
                                    item.date.seconds * 1000
                                ).toDateString()}
                            </p>
                            <h3 className={styles.col}>
                                {_.capitalize(item.description)}
                            </h3>
                            <p className={styles.col}>Cost:£{item.spend}</p>
                            <button onClick={() => handleDelete(item)}>
                                Delete
                            </button>
                        </>
                    </div>
                );
            })}
        </div>
    );
}
