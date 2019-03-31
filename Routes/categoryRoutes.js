const express = require('express');
const app = express.Router();
const category = require('../Controllers/categoryController');
const uploadFile = require('../Middlewares/file');
const uploadArray = require('../Middlewares/music');

app.get('/', category.getAllCategories);
app.post('/addCategory', uploadFile, category.saveCategory);
app.post('/edit/:category_id', uploadFile, category.editCategory);
app.get('/getAllSubCategories', uploadArray, category.getAllSubCategories);
app.post('/addSubCategory', uploadArray, category.saveSubCategory);
app.get('/:category_id', category.getSubCategoryById);
app.post('/editSubCategory/:sub_category_id', uploadFile, category.editSubCategory);

module.exports = app;