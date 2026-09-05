import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe } from "./authApi";

type User = { email: string; first_name?: string; last_name?: string };
type AuthCtx = {
    user: User | null;
    loading: boolean;
    setUser: (u: User | null) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        fetchMe()
            .then(setUser)
            .catch(() => {
                localStorage.removeItem("access_token");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    function logout() {
        localStorage.removeItem("access_token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}