import { useRouter } from "next/router";
import TotalBar from "../../../components/TotalBar";
import styles from "../../../styles/Home.module.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function DisplayExpense() {
    const router = useRouter();
    const { category } = router.query;
    const [pastSpend, setPastSpend] = useState([]);

    const totalSpend = () => {
        return pastSpend.reduce((acc, curr) => {
            return acc + +curr.cost;
        }, 0);
    };

    return (
        <main className={styles.main}>
            <h1>{category}</h1>
            <TotalBar total={totalSpend()} />
            <ExpenseAdder setPastSpend={setPastSpend} />
            <SingleExpenseDisplay pastSpend={pastSpend} />
        </main>
    );
}

function ExpenseAdder({ setPastSpend }) {
    const [input, setInput] = useState("");
    const [cost, setCost] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setPastSpend((prevValue) => {
            return [...prevValue, { desc: input, cost, uuid: uuidv4() }];
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

function SingleExpenseDisplay({ pastSpend }) {
    return pastSpend.map((item) => {
        return (
            <div key={item.uuid} className={styles.row}>
                <>
                    <h3 className={styles.col}>{item.desc}</h3>
                    <p className={styles.col}>Cost:£{item.cost}</p>
                </>
            </div>
        );
    });
}
