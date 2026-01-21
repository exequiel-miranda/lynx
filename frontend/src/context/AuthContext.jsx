import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const storedToken = authService.getToken();
        const storedUser = authService.getUser();

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }

        setLoading(false);
    }, []);

    const login = async (carnet, password) => {
        const data = await authService.login(carnet, password);
        setToken(data.token);
        setUser(data.student);
        return data;
    };

    const register = async (carnet, password) => {
        const data = await authService.register(carnet, password);
        setToken(data.token);
        setUser(data.student);
        return data;
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
