import { signInGoogle } from "../api/dbCalls";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
export default function AuthCheck({ children }) {
    const user = useContext(UserContext);

    const handleSignIn = async () => {
        try {
            const result = await signInGoogle();
            console.log(result.email);
        } catch (error) {
            const errorMessage = error.message;
            console.log(errorMessage);
        }
    };

    return !user ? (
        <div>
            <p>You must be signed in</p>
            <button onClick={handleSignIn}> Sign in</button>
        </div>
    ) : (
        children
    );
}
