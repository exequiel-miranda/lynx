const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const authMiddleware = require('../middleware/auth');

// Submit or update an answer (protected route)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { questionId, answer } = req.body;
        const studentCarnet = req.student.carnet;

        // Validate input
        if (!questionId || answer === undefined || answer === null) {
            return res.status(400).json({
                success: false,
                message: 'Question ID and answer are required'
            });
        }

        // Save answer
        const savedAnswer = await Answer.saveAnswer(studentCarnet, questionId, answer);

        res.status(savedAnswer.updated ? 200 : 201).json({
            success: true,
            message: savedAnswer.updated ? 'Answer updated successfully' : 'Answer saved successfully',
            data: {
                studentCarnet: savedAnswer.studentCarnet,
                questionId: savedAnswer.questionId,
                answer: savedAnswer.answer,
                timestamp: savedAnswer.timestamp,
                updated: savedAnswer.updated
            }
        });
    } catch (error) {
        console.error('Error saving answer:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving answer',
            error: error.message
        });
    }
});

// Get authenticated student's own answers (protected route)
router.get('/my-answers', authMiddleware, async (req, res) => {
    try {
        const studentCarnet = req.student.carnet;
        const answers = await Answer.getStudentAnswers(studentCarnet);

        res.json({
            success: true,
            carnet: studentCarnet,
            count: answers.length,
            answers
        });
    } catch (error) {
        console.error('Error fetching answers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching answers',
            error: error.message
        });
    }
});

// Get answers for a specific student by carnet (protected route)
router.get('/:carnet', authMiddleware, async (req, res) => {
    try {
        const { carnet } = req.params;
        const answers = await Answer.getStudentAnswers(carnet);

        res.json({
            success: true,
            carnet,
            count: answers.length,
            answers
        });
    } catch (error) {
        console.error('Error fetching student answers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student answers',
            error: error.message
        });
    }
});

// Get answer statistics for authenticated student (protected route)
router.get('/stats/me', authMiddleware, async (req, res) => {
    try {
        const studentCarnet = req.student.carnet;
        const stats = await Answer.getAnswerStats(studentCarnet);

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error fetching answer stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching answer statistics',
            error: error.message
        });
    }
});

// Delete an answer (protected route)
router.delete('/:questionId', authMiddleware, async (req, res) => {
    try {
        const { questionId } = req.params;
        const studentCarnet = req.student.carnet;

        const deleted = await Answer.deleteAnswer(studentCarnet, questionId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        res.json({
            success: true,
            message: 'Answer deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting answer:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting answer',
            error: error.message
        });
    }
});

module.exports = router;
