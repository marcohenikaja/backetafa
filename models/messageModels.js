const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const messageSchema = new mongoose.Schema({
    sender_id: {
        type: String,
        required: true
    },
    recipient_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})
const message = mongoose.model('message', messageSchema);

module.exports = message;