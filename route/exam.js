const Exam = require('../models/exam');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
//creating exam
router.get('/newexam', (req, res) => {
    res.render('createexam');
})
//getting a specific exam
router.get('/getexam/:name', async (req, res) => {
    try {
        const result = await Exam.find({ name: req.params.name }).exec();
        res.render('displayexam', {
            result, currentname: req.params.name
        })
    } catch (error) {
        res.send({ err: error.message });
    }
})
router.get('/', async (req, res) => {
    try {
        const result = await Exam.find(req.query).exec();
        const result2 = await Exam.find().countDocuments().exec();

        res.send(result);
    }
    catch (err) {
        res.send({ err: err.message });
    }
})
// getting single question
router.get('/:id', async (req, res) => {
    try {
        const result = await Exam.find({ _id: req.params.id }).exec();
        res.send(result);
    }
    catch (err) {
        res.send({ err: err.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const { answers, correctanswer } = req.body;
        const result = answers.includes(correctanswer);
        if (result) {
            const newexam = new Exam(req.body);
            await newexam.save();
            res.send({ status: "added succesfully..." })
        }
        else {
            res.status(400).send({ err: "correct answer must be from one of answers options" })
        }
    }
    catch (err) {
        res.send({ err: err.message })
    }
})
router.post('/checkexam', async (req, res) => {
    // console.log(req.body);
    const ids = req.body.ids;
    const answers = req.body.checkanswers;

    let finalarray = []

    for (let i = 0; i < ids.length; i++) {
        finalarray = [...finalarray, { _id: ids[i], correctanswer: answers[i].toLowerCase() }];
    }

    const result = await Exam.find({ name: req.body.currentname }, { correctanswer: 1 }).exec();


    //function for checking wrong answers
    function filterarray(arr1, arr2) {

        let result = [];
        arr1.filter(e => {
            arr2.forEach(el => {
                if (el._id.toString() === e._id) {

                    if (e.correctanswer !== el.correctanswer)
                        result = [...result, e]
                }

            })
        })
        return result;
    }
    let diff = filterarray(finalarray, result)

    let wronganswer = [];


    if (diff.length > 0) {
        wronganswer = await Exam.find().where('_id').in(diff).select('question correctanswer').exec();
    }


    res.render('finalexamresult', {
        finalexamresult: diff,
        correctanswer: result.length - diff.length,
        wronganswer: wronganswer
    })
})

// modify exam
router.put('/:id', async (req, res) => {
    try {
        const updatedexam = await Exam.updateOne({ _id: req.params.id }, { $set: req.body })
        res.send(updatedexam);
    }
    catch (err) {
        res.send({ err: err.message })
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const result = await Exam.deleteOne({ _id: req.params.id }).exec();
        res.send(result);
    } catch (error) {
        res.send({ err: err.message });
    }
})
module.exports = router;