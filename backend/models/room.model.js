import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
        unique: true
    },
    roomType: {
        type: String,
        required: true
    },
    roomCapacity: {
        type: Number,
        required: true
    },
    isClosed: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Room = mongoose.model("Room", roomSchema);

export default Room;