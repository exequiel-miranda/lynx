import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { questionService } from '../services/questions';
import { answerService } from '../services/answers';
import QuestionCard from '../components/QuestionCard';

const Questionnaire = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            setLoading(true);
            const data = await questionService.getQuestions();

            if (data.length === 0) {
                setError('No hay preguntas disponibles en este momento.');
                setLoading(false);
                return;
            }

            // Shuffle questions for randomization
            const shuffled = questionService.shuffleQuestions(data);
            setQuestions(shuffled);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar las preguntas. Por favor intenta de nuevo.');
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers({
            ...answers,
            [questionId]: value
        });
    };

    const handleSubmitAll = async () => {
        // Check if all questions have been answered
        const unansweredQuestions = questions.filter(q => !answers[q._id] || answers[q._id].trim() === '');

        if (unansweredQuestions.length > 0) {
            setError(`Por favor responde todas las preguntas. Faltan ${unansweredQuestions.length} pregunta(s).`);
            // Scroll to first unanswered question
            const firstUnanswered = document.getElementById(`question-${unansweredQuestions[0]._id}`);
            if (firstUnanswered) {
                firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            // Submit all answers
            const submitPromises = questions.map(question =>
                answerService.submitAnswer(question._id, answers[question._id])
            );

            await Promise.all(submitPromises);
            setCompleted(true);
        } catch (err) {
            setError('Error al guardar las respuestas. Por favor intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '4rem' }}>
                <div className="spinner"></div>
                <p className="text-center text-muted">Cargando preguntas...</p>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="container container-sm" style={{ paddingTop: '4rem' }}>
                <div className="card text-center">
                    <h1>¡Cuestionario Completado! 🎉</h1>
                    <p className="text-muted mb-xl">
                        Has respondido todas las preguntas. Tus respuestas han sido guardadas exitosamente.
                    </p>
                    <div className="alert alert-success">
                        Total de preguntas respondidas: {questions.length}
                    </div>
                    <button onClick={handleLogout} className="btn btn-primary">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="container container-sm" style={{ paddingTop: '4rem' }}>
                <div className="card">
                    <h2 className="text-center">No hay preguntas disponibles</h2>
                    <p className="text-center text-muted">
                        Por favor contacta al administrador.
                    </p>
                    <button onClick={handleLogout} className="btn btn-secondary btn-block">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        );
    }

    const answeredCount = Object.keys(answers).filter(key => answers[key] && answers[key].trim() !== '').length;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.25rem' }}>Cuestionario</h2>
                    <p className="text-muted text-sm">Estudiante: {user?.carnet}</p>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary">
                    Cerrar Sesión
                </button>
            </div>

            {/* Progress */}
            <div className="progress">
                Respondidas: {answeredCount} de {questions.length} preguntas
            </div>

            {/* Error message */}
            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* Info message */}
            <div className="alert alert-info">
                💡 Responde todas las preguntas y luego haz clic en "Enviar Todas las Respuestas" al final.
            </div>

            {/* All Questions */}
            {questions.map((question, index) => (
                <div key={question._id} id={`question-${question._id}`} style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>
                        Pregunta {index + 1}
                    </h3>
                    <QuestionCard
                        question={question}
                        answer={answers[question._id] || ''}
                        onAnswerChange={(value) => handleAnswerChange(question._id, value)}
                    />
                </div>
            ))}

            {/* Submit All Button */}
            <div style={{ position: 'sticky', bottom: '1rem', backgroundColor: 'var(--color-bg-secondary)', padding: '1rem 0' }}>
                <button
                    onClick={handleSubmitAll}
                    className="btn btn-primary btn-block"
                    disabled={submitting}
                    style={{ boxShadow: 'var(--shadow-lg)' }}
                >
                    {submitting ? 'Guardando respuestas...' : `Enviar Todas las Respuestas (${answeredCount}/${questions.length})`}
                </button>
            </div>
        </div>
    );
};

export default Questionnaire;
