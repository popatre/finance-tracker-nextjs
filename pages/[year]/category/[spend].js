import { useRouter } from "next/router";
import TotalBar from "../../../components/TotalBar";
import styles from "../../../styles/Spend.module.css";
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
import { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { setSpendInDatabase } from "../../../helpers/setSpend";
import _ from "lodash";
import { UserContext } from "../../../contexts/UserContext";
import { getSpend } from "../../../api/dbCalls";
import toast, { Toaster } from "react-hot-toast";
import LoadingIcon from "../../../components/Loading";
import AuthCheck from "../../../components/AuthCheck";

/*https://www.npmjs.com/package/react-circular-progressbar */

export default function DisplayExpense() {
    const router = useRouter();
    const { spend, year } = router.query;
    const [pastSpend, setPastSpend] = useState([]);
    const user = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getSpend(user, year, spend)
            .then((result) => {
                setIsLoading(false);
                setPastSpend(result);
            })
            .catch((err) => console.log(err));
    }, [spend, user]);

    const totalSpend = () => {
        const total = pastSpend.reduce((acc, curr) => {
            return acc + +curr.spend;
        }, 0);
        return total.toFixed(2);
    };

    return (
        <main className={styles.container}>
            <AuthCheck>
                <h1>{_.capitalize(spend)}</h1>
                <TotalBar total={totalSpend()} />
                {isLoading ? (
                    <LoadingIcon />
                ) : (
                    <>
                        <ExpenseAdder
                            setPastSpend={setPastSpend}
                            year={year}
                            spend={spend}
                            user={user}
                        />

                        <SingleExpenseDisplay
                            pastSpend={pastSpend}
                            year={year}
                            spend={spend}
                            setPastSpend={setPastSpend}
                        />
                    </>
                )}
            </AuthCheck>
        </main>
    );
}

function ExpenseAdder({ setPastSpend, year, spend, user }) {
    const [input, setInput] = useState("");
    const [cost, setCost] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const date = serverTimestamp();
        const uid = uuidv4();

        setSpendInDatabase(input, cost, date, uid, year, spend, user.email)
            .then(() => {
                setPastSpend((prevValue) => {
                    const parsedDate = new Date().getTime() / 1000;
                    return [
                        {
                            description: input,
                            spend: cost,
                            date: { seconds: parsedDate },
                            uid,
                        },
                        ...prevValue,
                    ];
                });
                setInput("");
                setCost("");
                toast.success("New Spend Added");
            })
            .catch(() => {
                toast.error("Something went wrong. Please try again");
            });
    };

    return (
        <form className="expense__form" onSubmit={handleSubmit}>
            <div className={styles.rowForm}>
                <div className={styles.colForm}>
                    <label htmlFor="expense">Expense:</label>
                </div>
                <div className={styles.colForm}>
                    <input
                        required
                        name="expense"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></input>
                </div>
            </div>
            <div className={styles.rowForm}>
                <div className={styles.colForm}>
                    <label htmlFor="cost">Cost:</label>
                </div>
                <div className={styles.colForm}>
                    <input
                        required
                        name="cost"
                        value={cost}
                        type="number"
                        onChange={(e) => setCost(e.target.value)}
                    ></input>
                </div>
            </div>
            <button className={styles.spendBtn}>Add Expense</button>
        </form>
    );
}

function SingleExpenseDisplay({ pastSpend, year, spend, setPastSpend }) {
    const user = useContext(UserContext);
    const [errorMsg, setErrorMsg] = useState("");

    const handleDelete = async (documentToDelete) => {
        const docRef = `username/${user.email}/${year}/${spend}/spend`;
        const collectionRef = collection(db, docRef);

        const dbQuery = query(
            collectionRef,
            where("uid", "==", documentToDelete.uid)
        );
        const querySnapshot = await getDocs(dbQuery);

        querySnapshot.forEach(async (document) => {
            try {
                await deleteDoc(doc(db, docRef, document.id));
                toast.success("Deleted");
                setPastSpend((prevSpends) => {
                    return prevSpends.filter((item) => {
                        return item.uid !== documentToDelete.uid;
                    });
                });
            } catch (error) {
                console.log(error);
                toast.error("Please try again");
                setErrorMsg(
                    "Something went wrong. Please refresh and try again"
                );
            }
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
                            {errorMsg ? (
                                <p className={styles.errorMsg}>{errorMsg}</p>
                            ) : (
                                <button
                                    className={styles["delete-btn"]}
                                    onClick={() => handleDelete(item)}
                                >
                                    Delete
                                </button>
                            )}
                        </>
                    </div>
                );
            })}
        </div>
    );
}
