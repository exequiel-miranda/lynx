import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [carnet, setCarnet] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!carnet || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setLoading(true);

        try {
            await login(carnet, password);
            navigate('/questionnaire');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container container-sm" style={{ paddingTop: '4rem' }}>
            <div className="card">
                <h1 className="text-center">Iniciar Sesión</h1>
                <p className="text-center text-muted mb-xl">
                    Ingresa con tu carnet y contraseña
                </p>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="carnet">Carnet</label>
                        <input
                            type="text"
                            id="carnet"
                            value={carnet}
                            onChange={(e) => setCarnet(e.target.value)}
                            placeholder="Ej: 20250505"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className="text-center mt-lg text-sm">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="link">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
