const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { ObjectId } = require('mongodb');

// Get all questions (protected route)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const db = getDB();
        const questions = await db.collection('QA').find({}).toArray();

        res.json({
            success: true,
            count: questions.length,
            questions
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching questions',
            error: error.message
        });
    }
});

// Get questions by area (protected route)
router.get('/area/:area', authMiddleware, async (req, res) => {
    try {
        const { area } = req.params;
        const db = getDB();

        const questions = await db.collection('QA')
            .find({ area: area })
            .toArray();

        res.json({
            success: true,
            area,
            count: questions.length,
            questions
        });
    } catch (error) {
        console.error('Error fetching questions by area:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching questions',
            error: error.message
        });
    }
});

// Get questions by difficulty (protected route)
router.get('/difficulty/:difficulty', authMiddleware, async (req, res) => {
    try {
        const { difficulty } = req.params;
        const db = getDB();

        const questions = await db.collection('QA')
            .find({ dificultad: difficulty })
            .toArray();

        res.json({
            success: true,
            difficulty,
            count: questions.length,
            questions
        });
    } catch (error) {
        console.error('Error fetching questions by difficulty:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching questions',
            error: error.message
        });
    }
});

// Get single question by ID (protected route)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid question ID format'
            });
        }

        const question = await db.collection('QA')
            .findOne({ _id: new ObjectId(id) });

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.json({
            success: true,
            question
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching question',
            error: error.message
        });
    }
});

module.exports = router;
