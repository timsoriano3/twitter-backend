const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    fromUser: {
        type: mongoose.Schema.Types.String,
        ref: 'User'
    },
/*     toUsers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }], */
    content: {
        type: String,
        required: true,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;