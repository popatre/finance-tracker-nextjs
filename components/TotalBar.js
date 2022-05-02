export default function TotalBar({ total }) {
    const totalValues = Object.values(total).reduce((a, b) => +a + +b);
    console.log(totalValues);
    return <h2>Total spent:£{totalValues}</h2>;
}
