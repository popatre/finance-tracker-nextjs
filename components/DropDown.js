import { useRouter } from "next/router";

export default function DropDown({ setMonth, year }) {
    const router = useRouter();
    const { month, year: routerYear } = router.query;

    let selectedYear = routerYear || year;

    const handleChange = (e) => {
        const { value } = e.target;
        setMonth(value);
        router.push(`/${selectedYear}/${value}`);
    };
    return (
        <form className="dropdown__form">
            <label htmlFor="months">Choose a month:</label>

            <select onChange={handleChange} value={month} id="months">
                <option value="DEFAULT" disabled selected></option>
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
                <option value="july">July</option>
                <option value="august">August</option>
                <option value="september">September</option>
                <option value="october">October</option>
                <option value="november">November</option>
                <option value="december">December</option>
            </select>
        </form>
    );
}
