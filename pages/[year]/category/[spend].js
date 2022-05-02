import { useRouter } from "next/router";
import TotalBar from "../../../components/TotalBar";
import styles from "../../../styles/Home.module.css";
import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function DisplayExpense() {
    const router = useRouter();
    const { spend, year } = router.query;
    const [pastSpend, setPastSpend] = useState([]);

    useEffect(() => {
        getSpend();
    }, [spend]);

    const getSpend = async () => {
        const collectionRef = `username/jon/${year}/${spend}/spend`;

        const querySnapshot = await getDocs(collection(db, collectionRef));

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
        <main className={styles.main}>
            <h1>{spend}</h1>
            <TotalBar total={totalSpend()} />
            <ExpenseAdder
                setPastSpend={setPastSpend}
                year={year}
                spend={spend}
            />
            <SingleExpenseDisplay pastSpend={pastSpend} />
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

        setSpendInDatabase(input, cost, date, uid);

        setInput("");
        setCost("");
    };

    const setSpendInDatabase = async (description, cost, date, uid) => {
        try {
            const collectionRef = `username/jon/${year}/${spend}/spend`;
            const docRef = await addDoc(collection(db, collectionRef), {
                description,
                spend: cost,
                date,
                uid,
            });
            console.log("Document written with ID: ", docRef.id);
            setPastSpend((prevValue) => {
                return [...prevValue, { description, spend: cost, date }];
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
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

function SingleExpenseDisplay({ pastSpend }) {
    return pastSpend.map((item) => {
        return (
            <div key={item.uid} className={styles.row}>
                <>
                    <p className={styles.col}>
                        {new Date(item.date.seconds * 1000).toDateString()}
                    </p>
                    <h3 className={styles.col}>{item.description}</h3>
                    <p className={styles.col}>Cost:£{item.spend}</p>
                </>
            </div>
        );
    });
}
