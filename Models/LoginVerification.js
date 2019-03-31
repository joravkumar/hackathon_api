const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    otp: {
        type: String,
        required: [true, 'OTP is required']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LoginVerification', postSchema);