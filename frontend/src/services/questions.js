import api from './api';

export const questionService = {
    async getQuestions() {
        const response = await api.get('/questions');
        return response.data.questions || [];
    },

    shuffleQuestions(questions) {
        const shuffled = [...questions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};
