import { useRouter } from "next/router";
import styles from "../../styles/Year.module.css";
import TotalBar from "../../components/TotalBar";
import Link from "next/link";
import AuthCheck from "../../components/AuthCheck";
import DropDown from "../../components/DropDown";
import {
    addNewCategory,
    deleteCategory,
    getCategories,
    updateIncome,
} from "../../api/dbCalls";
import { useState, useEffect, useContext } from "react";
import { findTotal } from "../../helpers/findTotal";
import { UserContext } from "../../contexts/UserContext";
import LoadingIcon from "../../components/Loading";
import Error404 from "../../components/error404";
import { FaRegTrashAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function Home({ setMonth, month }) {
    const [spends, setSpends] = useState([]);
    const [topicTotal, setTopicTotals] = useState({
        food: 0,
        misc: 0,
        "direct-debits": 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [incomeUpdated, setIncomeUpdated] = useState(false);
    const [nonRoute, setNonRoute] = useState(false);
    const user = useContext(UserContext);

    const monthGreenList = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
    ];

    const router = useRouter();
    const { year } = router.query;

    useEffect(() => {
        setIsLoading(true);
        setNonRoute(false);

        if (monthGreenList.includes(year)) {
            getCategories(user, year)
                .then((topics) => {
                    setSpends(topics);
                    setIsLoading(false);
                    topics.forEach((topic) => {
                        findTotal(topic, year, user?.email).then((res) => {
                            setTopicTotals((prevState) => {
                                return { ...prevState, [topic]: res };
                            });
                        });
                    });
                })
                .catch((err) => console.log(err));
        } else {
            setNonRoute(true);
        }
    }, [year, user]);

    if (nonRoute) {
        return <Error404 code="404" message="Page Not Found" />;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Outgoings: {year}</h1>
            <AuthCheck>
                <DropDown month={month} setMonth={setMonth} />
                <IncomeSetter
                    user={user}
                    year={year}
                    setIncomeUpdated={setIncomeUpdated}
                />
                <TotalBar
                    total={topicTotal}
                    user={user}
                    year={year}
                    incomeUpdated={incomeUpdated}
                />
                {isLoading ? (
                    <LoadingIcon />
                ) : (
                    <SpendTopicContainer
                        spends={spends}
                        topicTotal={topicTotal}
                        user={user}
                        setSpends={setSpends}
                        setTopicTotals={setTopicTotals}
                    />
                )}
            </AuthCheck>
        </div>
    );
}

function SpendTopicContainer({
    spends,
    topicTotal,
    user,
    setSpends,
    setTopicTotals,
}) {
    const router = useRouter();
    const { year } = router.query;
    return (
        <main>
            {spends.map((item) => {
                return (
                    <TopicDisplay
                        key={item}
                        item={item}
                        topicTotal={topicTotal}
                        year={year}
                        user={user}
                        setSpends={setSpends}
                        setTopicTotals={setTopicTotals}
                    />
                );
            })}
            <AddNewCategory user={user} year={year} />
        </main>
    );
}

function TopicDisplay({
    item,
    topicTotal,
    year,
    user,
    setSpends,
    setTopicTotals,
}) {
    const handleDelete = async (cat) => {
        await deleteCategory(cat, user, year);
        toast.success("Deleted");
        setSpends((prevSpends) => {
            return prevSpends.filter((item) => {
                return item !== cat;
            });
        });
        setTopicTotals((prevTotal) => {
            const copyObj = { ...prevTotal };
            delete copyObj[cat];
            return copyObj;
        });
    };

    const defaults = ["food", "misc", "direct-debits"];
    return (
        <div className={`${styles.row} ${styles.card}`}>
            <Link key={item} href={`${year}/category/${item}`}>
                <div className={`${styles.row__inside} `}>
                    <h2 className={styles.col}>{item}</h2>
                    <p className={styles.col}>£{topicTotal[item]}</p>
                </div>
            </Link>
            {!defaults.includes(item) ? (
                <button
                    className={styles["delete-btn"]}
                    onClick={() => handleDelete(item)}
                >
                    <FaRegTrashAlt />
                </button>
            ) : null}
        </div>
    );
}

function IncomeSetter({ user, year, setIncomeUpdated }) {
    const [input, setInput] = useState("");
    const [isIncome, setIsIncome] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateIncome(user, year, input);
            setIsIncome(false);
            setIncomeUpdated((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    return !isIncome ? (
        <div>
            <button
                className={styles.btn__income}
                onClick={() => setIsIncome(true)}
            >
                {" "}
                Change monthly income
            </button>
        </div>
    ) : (
        <div className={styles.input__cont}>
            <form className={styles.income__form} onSubmit={handleSubmit}>
                <input
                    placeholder="Set Income"
                    type="number"
                    id="income"
                    name="income"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button>Submit</button>
            </form>
        </div>
    );
}

function AddNewCategory({ user, year }) {
    const router = useRouter();

    const [isClicked, setIsClicked] = useState(false);
    const [input, setInput] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addNewCategory(input, user, year);
            router.push(`${year}/category/${input}`);
        } catch (error) {
            setErrorMsg("Something went wrong. Please refresh and try again");
        }
    };

    const handleCancel = () => {
        setIsClicked(false);
        setInput("");
    };

    return (
        <div
            className={
                isClicked
                    ? `${styles.row} ${styles.card__addForm}`
                    : `${styles.row} ${styles.card__addNew}`
            }
        >
            {!isClicked ? (
                <h2
                    onClick={() => setIsClicked(true)}
                    className={styles.col__addNew}
                >
                    Add New Category
                </h2>
            ) : !errorMsg ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        {" "}
                        Category name:
                        <input onChange={(e) => setInput(e.target.value)} />
                    </label>
                    <button disabled={isDisabled}>
                        {!isDisabled ? "Create" : "Processing..."}
                    </button>
                    <button onClick={handleCancel}>Cancel</button>
                </form>
            ) : (
                { errorMsg }
            )}
        </div>
    );
}
