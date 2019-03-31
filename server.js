const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const userRoutes = require('./Routes/userRoutes');
const postRoutes = require('./Routes/postRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
// const commentRoutes = require('./Routes/commentRoutes');

mongoose.connect('mongodb://localhost:27017/hackathon', {
        useNewUrlParser: true
    })
    .then(_ => {
        console.log('Connection with Mongodb established successfully');
    })
    .catch(err => {
        console.log('Error While Establishing Connection' + err);
    });
mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    next();
});

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

// app.use('/api/comments', commentRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/images', express.static('images'));
app.use('/music', express.static('music'));

app.use((req, res, next) => {
    const error = new Error('404 Not Found');
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        success: false,
        msg: error.message
    });
});

const PORT = process.env.port || 3001;

app.listen(PORT, _ => {
    console.log(`Server is running on ${PORT}`)
})