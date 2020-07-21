const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
var morgan = require('morgan');
const helmet = require("helmet");
const Exam = require('./models/exam');


//myroutes
const examroute = require('./route/exam');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })) //for parsing form data in request.
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(morgan('combined'));
app.use(helmet());

//use route

app.use('/exam', examroute);


//connecting mongodb
let mongodburi = process.env.MONGODB_URI || 'mongodb://localhost:27017/Exampaper'
mongoose.connect(mongodburi, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log("Database connected..."))
    .catch(error => console.log(err));


app.get('/', async (req, res) => {

    const diffexam = await Exam.distinct('name');

    res.render('index', {
        diffquiz: diffexam
    });
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));