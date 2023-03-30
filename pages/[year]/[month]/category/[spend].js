import { useRouter } from "next/router";
import TotalBar from "../../../../components/TotalBar";
import styles from "../../../../styles/Spend.module.css";
import {
    collection,
    getDocs,
    serverTimestamp,
    doc,
    deleteDoc,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { setSpendInDatabase } from "../../../../helpers/setSpend";
import _ from "lodash";
import { UserContext } from "../../../../contexts/UserContext";
import { getSpend, getSpendsInDb } from "../../../../api/dbCalls";
import toast, { Toaster } from "react-hot-toast";
import LoadingIcon from "../../../../components/Loading";
import AuthCheck from "../../../../components/AuthCheck";
import { FaRegTrashAlt } from "react-icons/fa";
import Error404 from "../../../../components/error404";

export default function DisplayExpense() {
    const router = useRouter();
    const { spend, month, year } = router.query;
    const [pastSpend, setPastSpend] = useState([]);
    const user = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
        getSpendsInDb(user, month, spend, year)
            .then(() => {
                setIsError(false);
                return getSpend(user, month, spend, year);
            })
            .then((result) => {
                setIsLoading(false);

                setPastSpend(result);
            })
            .catch((err) => {
                console.log(err);
                setIsError(true);
            });
    }, [spend, user, month]);

    const totalSpend = () => {
        const total = pastSpend.reduce((acc, curr) => {
            return acc + +curr.spend;
        }, 0);
        return total.toFixed(2);
    };

    if (isError)
        return (
            <main className={styles.container}>
                <AuthCheck>
                    <Error404 code="404" message="Page Not Found" />;
                </AuthCheck>
            </main>
        );

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
                            month={month}
                            spend={spend}
                            user={user}
                            year={year}
                        />

                        <SingleExpenseDisplay
                            pastSpend={pastSpend}
                            month={month}
                            spend={spend}
                            setPastSpend={setPastSpend}
                            year={year}
                        />
                    </>
                )}
            </AuthCheck>
        </main>
    );
}

function ExpenseAdder({ setPastSpend, month, spend, user, year }) {
    const [input, setInput] = useState("");
    const [cost, setCost] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const date = serverTimestamp();
        const uid = uuidv4();

        setSpendInDatabase(
            input,
            cost,
            date,
            uid,
            month,
            spend,
            user.email,
            year
        )
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
                    <label htmlFor="cost">Cost:</label>
                </div>

                <div className={styles.colForm}>
                    <textarea
                        required
                        rows="2"
                        name="expense"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></textarea>
                    <input
                        className={styles.costForm}
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

function SingleExpenseDisplay({ pastSpend, month, spend, setPastSpend, year }) {
    const user = useContext(UserContext);
    const [errorMsg, setErrorMsg] = useState("");

    const handleDelete = async (documentToDelete) => {
        const docRef = `username/${user.email}/year/${year}/${month}/${spend}/spend`;
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
        <div className={styles.container__spends}>
            {pastSpend.map((item) => {
                return (
                    <div
                        key={item.uid}
                        className={`${styles.row} ${styles.card}`}
                    >
                        <>
                            <p className={`${styles.col} ${styles.date}`}>
                                {new Date(
                                    item.date.seconds * 1000
                                ).toDateString()}
                            </p>
                            <h3 className={styles.col}>
                                {_.capitalize(item.description)}
                            </h3>
                            <p className={`${styles.col} ${styles.cost}`}>
                                Cost:£{item.spend}
                            </p>
                            {errorMsg ? (
                                <p className={styles.errorMsg}>{errorMsg}</p>
                            ) : (
                                <button
                                    className={styles["delete-btn"]}
                                    onClick={() => handleDelete(item)}
                                >
                                    <FaRegTrashAlt />
                                </button>
                            )}
                        </>
                    </div>
                );
            })}
        </div>
    );
}
