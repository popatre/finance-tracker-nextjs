export default function TotalBar({ total }) {
    const totalValues = Object.values(total).reduce((a, b) => +a + +b);
    return typeof total !== "object" ? (
        <h2>Total spent:£{total}</h2>
    ) : (
        <h2>Total spent:£{totalValues.toFixed(2)}</h2>
    );
}
