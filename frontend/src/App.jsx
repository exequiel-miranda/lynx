import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Questionnaire from './pages/Questionnaire';
import './index.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/questionnaire"
                        element={
                            <ProtectedRoute>
                                <Questionnaire />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
