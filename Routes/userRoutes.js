const express = require('express');
const app = express.Router();
const user = require('../Controllers/userController');

app.get('/', user.getAllUsers);
app.post('/artists/login', user.artistLogin);
app.get('/artists', user.getArtists);
app.post('/signup', user.saveUser);
app.post('/login', user.loginUser);
app.post('/forgot', user.forgotPassword);
app.post('/checkotp', user.checkOtp);
app.post('/resetpassword', user.resetPassword);

module.exports = app;