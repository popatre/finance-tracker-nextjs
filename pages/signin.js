import { signInGoogle } from "../api/dbCalls";

export default function SignInPage() {
    const handleSignIn = async () => {
        try {
            const result = await signInGoogle();
            console.log(result.email);
        } catch (error) {
            const errorMessage = error.message;
            console.log(errorMessage);
        }
    };

    // onAuthStateChanged(auth, (user) => {
    //     console.log(user.email);
    // });

    return (
        <div>
            <h2>Sign in</h2>
            <button onClick={handleSignIn}>Sign in</button>
        </div>
    );
}
