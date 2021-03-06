import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
        });
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
