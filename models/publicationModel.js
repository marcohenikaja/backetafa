const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const publicationSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender_id: {
        type: String,
        required: true
    },

    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const publication = mongoose.model("publication", publicationSchema);
module.exports = publication;
