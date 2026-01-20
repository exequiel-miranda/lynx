const bcrypt = require('bcrypt');
const { getDB } = require('../config/database');

class Student {
    static getCollection() {
        return getDB().collection('students');
    }

    static async create(carnet, password) {
        // Validate input
        if (!carnet || !password) {
            throw new Error('Carnet and password are required');
        }

        // Check if student already exists
        const existing = await this.findByCarnet(carnet);
        if (existing) {
            throw new Error('Student with this carnet already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create student document
        const student = {
            carnet,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.getCollection().insertOne(student);

        return {
            _id: result.insertedId,
            carnet: student.carnet,
            createdAt: student.createdAt
        };
    }

    static async findByCarnet(carnet) {
        return await this.getCollection().findOne({ carnet });
    }

    static async validatePassword(carnet, password) {
        const student = await this.findByCarnet(carnet);

        if (!student) {
            return false;
        }

        return await bcrypt.compare(password, student.password);
    }

    static async updatePassword(carnet, newPassword) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const result = await this.getCollection().updateOne(
            { carnet },
            {
                $set: {
                    password: hashedPassword,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    }
}

module.exports = Student;
