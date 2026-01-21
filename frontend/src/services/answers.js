import api from './api';

export const answerService = {
    async submitAnswer(questionId, answer) {
        const response = await api.post('/answers', { questionId, answer });
        return response.data;
    },

    async getMyAnswers() {
        const response = await api.get('/answers/my-answers');
        return response.data.answers || [];
    },

    async getStudentAnswers(carnet) {
        const response = await api.get(`/answers/${carnet}`);
        return response.data.answers || [];
    }
};
