const mongoose = require('mongoose');

const examschema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    question: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        required: true
    },
    answers: {
        type: [String],
        validate: {
            validator: function (value) {
                return value.length <= 5;
            },
            message: 'answers not exceeded above 5 options'
        },
        required: true
    },
    correctanswer: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,

    }
}

    , { timestamps: true })




const Exam = new mongoose.model('exam', examschema, 'exams');


module.exports = Exam;
