const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    post_name: {
        type: String,
        required: [true, 'Post name is required']
    },
    is_active: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: [true, 'image is required']
    },
    category_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Category Id is required']
    },
    sub_category_id: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Sub Category Id is required']    
    },
    views: {
        type: String,
        default: "0"
    },
    price: {
        type: String,
        default: "0"
    },
    file_type: {
        type: String,
        default: "image"
    }
}, {
    timestamps: true
});

// postSchema.index({post_name: 'text', 'post_name':'text'});
// postSchema.index({'$**': 'text'});

module.exports = mongoose.model('Post', postSchema);