import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [carnet, setCarnet] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!carnet || !password || !confirmPassword) {
            setError('Por favor completa todos los campos');
            return;
        }

        if (!/^\d+$/.test(carnet)) {
            setError('El carnet debe contener solo números');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            await register(carnet, password);
            navigate('/questionnaire');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse. Intenta con otro carnet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container container-sm" style={{ paddingTop: '4rem' }}>
            <div className="card">
                <h1 className="text-center">Registro</h1>
                <p className="text-center text-muted mb-xl">
                    Crea tu cuenta para realizar el cuestionario
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
                        <small className="text-muted text-sm">Solo números</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repite tu contraseña"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <p className="text-center mt-lg text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="link">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
