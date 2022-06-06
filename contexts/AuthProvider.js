import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function UserContextProvider({ children }) {
    const [user, setUser] = useState(() => {
        const currUser = auth.currentUser;
        return currUser;
    });

    useEffect(() => {
        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
            }
        });
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
