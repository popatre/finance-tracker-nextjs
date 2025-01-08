import { useRouter } from "next/router";

function YearDropDown({ setYear, year }) {
    const router = useRouter();
    let { year1 } = router.query;

    if (!year1 && year) {
        year1 = year;
    }

    const handleChange = (e) => {
        const { value } = e.target;
        setYear(value);
    };

    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 1;

    function generateYearOptions() {
        const options = [];
        for (let year = currentYear; year <= maxYear; year++) {
            options.push(
                <option key={year} value={year}>
                    {year}
                </option>
            );
        }
        return options;
    }

    return (
        <form className="dropdown__form">
            <label htmlFor="years">Choose a year:</label>

            <select onChange={handleChange} value={year1} id="years">
                <option value="DEFAULT" disabled selected></option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                {generateYearOptions()}
            </select>
        </form>
    );
}

export default YearDropDown;
