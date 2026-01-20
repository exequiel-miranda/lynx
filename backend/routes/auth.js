const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { generateToken } = require('../utils/jwt');

// Register a new student
router.post('/register', async (req, res) => {
    try {
        const { carnet, password } = req.body;

        // Validate input
        if (!carnet || !password) {
            return res.status(400).json({
                success: false,
                message: 'Carnet and password are required'
            });
        }

        // Validate carnet format (should be numeric)
        if (!/^\d+$/.test(carnet)) {
            return res.status(400).json({
                success: false,
                message: 'Carnet must contain only numbers'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Create student
        const student = await Student.create(carnet, password);

        // Generate token
        const token = generateToken({
            carnet: student.carnet,
            _id: student._id
        });

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            token,
            student: {
                carnet: student.carnet,
                createdAt: student.createdAt
            }
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error registering student',
            error: error.message
        });
    }
});

// Login student
router.post('/login', async (req, res) => {
    try {
        const { carnet, password } = req.body;

        // Validate input
        if (!carnet || !password) {
            return res.status(400).json({
                success: false,
                message: 'Carnet and password are required'
            });
        }

        // Validate credentials
        const isValid = await Student.validatePassword(carnet, password);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid carnet or password'
            });
        }

        // Get student info
        const student = await Student.findByCarnet(carnet);

        // Generate token
        const token = generateToken({
            carnet: student.carnet,
            _id: student._id
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            student: {
                carnet: student.carnet
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

module.exports = router;
