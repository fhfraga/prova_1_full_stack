const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');

const RoomSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    capacity: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    participants: [{ 
        type: String 
    }]
});

module.exports = mongoose.model('Room', RoomSchema);
