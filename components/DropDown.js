import { useRouter } from "next/router";

export default function DropDown({ setMonth, month }) {
    const router = useRouter();
    const { year } = router.query;

    const handleChange = (e) => {
        const { value } = e.target;
        setMonth(value);
        router.push(`${value}`);
    };
    return (
        <form className="dropdown__form">
            <label htmlFor="months">Choose a month:</label>

            <select onChange={handleChange} value={year} id="months">
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
            </select>
        </form>
    );
}
