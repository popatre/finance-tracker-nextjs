import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
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
            setUser(firebaseUser);
        });
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
