const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

class Answer {
    static getCollection() {
        return getDB().collection('answers');
    }

    static async saveAnswer(studentCarnet, questionId, answer) {
        // Validate input
        if (!studentCarnet || !questionId || answer === undefined || answer === null) {
            throw new Error('Student carnet, question ID, and answer are required');
        }

        // Check if answer already exists for this student and question
        const existing = await this.getCollection().findOne({
            studentCarnet,
            questionId
        });

        const answerDoc = {
            studentCarnet,
            questionId,
            answer,
            timestamp: new Date()
        };

        if (existing) {
            // Update existing answer
            const result = await this.getCollection().updateOne(
                { studentCarnet, questionId },
                { $set: answerDoc }
            );

            return {
                ...answerDoc,
                _id: existing._id,
                updated: true
            };
        } else {
            // Create new answer
            const result = await this.getCollection().insertOne(answerDoc);

            return {
                ...answerDoc,
                _id: result.insertedId,
                updated: false
            };
        }
    }

    static async getStudentAnswers(studentCarnet) {
        const answers = await this.getCollection()
            .find({ studentCarnet })
            .sort({ timestamp: -1 })
            .toArray();

        return answers;
    }

    static async getAnswerByQuestionId(studentCarnet, questionId) {
        return await this.getCollection().findOne({
            studentCarnet,
            questionId
        });
    }

    static async deleteAnswer(studentCarnet, questionId) {
        const result = await this.getCollection().deleteOne({
            studentCarnet,
            questionId
        });

        return result.deletedCount > 0;
    }

    static async getAnswerStats(studentCarnet) {
        const totalAnswers = await this.getCollection().countDocuments({ studentCarnet });

        return {
            totalAnswers,
            studentCarnet
        };
    }
}

module.exports = Answer;
