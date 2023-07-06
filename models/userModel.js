const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const userLogin = mongoose.model("userLogin", userSchema)
module.exports = userLogin;