const express = require('express');
const app = express.Router();
const post = require('../Controllers/postController');
const uploadArray = require('../Middlewares/music');

app.get('/', post.getAllPost);
app.post('/searchPost', post.searchPost);
app.get('/popularPost', post.popularPost);
app.get('/threePopularPost', post.threePopularPost);
app.post('/addPost', uploadArray, post.savePost);
app.delete('/delete/:post_id', post.deletePost);
app.get('/single/:post_id', post.getPostById);
app.get('/:sub_category_id', post.getPosts);

module.exports = app;