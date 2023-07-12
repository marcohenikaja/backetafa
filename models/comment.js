const mongoose = require('mongoose');
const { schema } = require('./userModel');
mongoose.set('strictQuery', false);

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    id_pub: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    anarana: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,     
        default: Date.now
    }
})
const Comment = new mongoose.model('comment', commentSchema)
module.exports = Comment;

