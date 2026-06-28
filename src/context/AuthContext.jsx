import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // 2. Listen for auth changes (sign in, sign out, etc.)
        const { data: { subscription: listener } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => {
            listener.unsubscribe();
        };
    }, []);

    // Sign up
    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error("problem signing up: ", error);
            return { success: false, error: error.message };
        }
        return { success: true, data };
    };

    // Sign in
    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                console.error("sign in error occurred: ", error);
                return { success: false, error: error.message };
            }
            return { success: true, data };
        } catch (error) {
            console.error("error: ", error);
            return { success: false, error: "An unexpected error occurred." };
        }
    };

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("error: ", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ session, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};