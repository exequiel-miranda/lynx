const QuestionCard = ({ question, answer, onAnswerChange }) => {
    return (
        <div className="card">
            {/* Question metadata */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">
                    {question.area}
                </span>
                <span className="badge">
                    {question.tipo?.replace('_', ' ')}
                </span>
                <span className="badge">
                    {question.dificultad}
                </span>
            </div>

            {/* Question text */}
            <h3 style={{ marginBottom: '1.5rem', lineHeight: '1.5' }}>
                {question.pregunta}
            </h3>

            {/* Answer input */}
            <div className="form-group">
                <label htmlFor="answer">Tu respuesta:</label>
                <textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    rows="6"
                />
            </div>
        </div>
    );
};

export default QuestionCard;
