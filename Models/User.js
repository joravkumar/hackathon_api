const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user_name: {
        type: String,
        required: [true, 'User name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    mobile_no: {
        type: String,
        required: [true, 'Mobile number is required']
    },
    role: {
        type: String,
        default: "User"
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);