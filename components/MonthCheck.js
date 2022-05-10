import { UserContext } from "../contexts/UserContext";
import { useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

// export default function AuthCheck({ children }) {
//     const { user } = useContext(UserContext);
//     console.log(user, "*****");

//     // return year ? children : null;
//     return children;
// }

export default function UserContextProvider({ children }) {
    const [user, setUser] = useState(() => {
        const user = auth.currentUser;

        return user;
    });

    useEffect(() => {
        onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser.email);
        });
    }, []);
    console.count(user, "********");
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
