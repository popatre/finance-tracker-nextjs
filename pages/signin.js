import { auth, provider } from "../firebase/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

export default function SignInPage() {
    const handleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result.user.email);
        } catch (error) {
            const errorMessage = error.message;
            console.log(error);
        }
    };

    onAuthStateChanged(auth, (user) => {
        console.log(user.email);
    });

    return (
        <div>
            <h2>Sign in</h2>
            <button onClick={handleSignIn}>Sign in</button>
        </div>
    );
}
