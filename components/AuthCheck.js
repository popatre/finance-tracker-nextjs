import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
export default function AuthCheck({ children }) {
    const user = useContext(UserContext);

    return !user ? (
        <div>
            <p>You must be signed in</p>
            <button> Sign in</button>
        </div>
    ) : (
        children
    );
}
