import axios from "axios";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

//Defining shape of user and auth context
interface User {
    id: string,
    username: string,
    email: string
}

interface AuthContextType{
    user: User | null,
    token: string | null,
    login: (userData: any) => void;
    logout: () => void;
    loading: boolean
}

//Create the context 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Provider
export const AuthProvider = ({children}:{children: ReactNode})=>{
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    useEffect(()=>{
        //On initil load check for token and user in local storage
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if(storedToken && storedUser){
            setToken(storedToken);
            setUser(JSON.parse(storedUser))
        }
        setLoading(false);
    },[])

    const login = (data: {user: User, token: string})=>{
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        router.push('/');
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        router.push('/auth');
    };

    const value = {
        user,
        token,
        login,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

// Create a custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};