const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chatTitle: {
        type: String,
        default: '',
        trim: true
    },
    isGroup: {
        type: Boolean,
        default: false,
    },
    users: [{
        type: mongoose.Schema.Types.String,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;