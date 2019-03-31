const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    sub_category_name: {
        type: String,
        required: [true, 'Sub Category name is required']
    },
    image: 
    {
        type: String,
        required: [true, 'Image is required']
    }
},
);

const categorySchema = mongoose.Schema({
    category_name: {
        type: String,
        required: [true, 'Category name is required']
    },
    image:
    {
        type: String,
        required: [true, 'Image is required']
    },
    sub_categories: [subCategorySchema],
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Category', categorySchema);