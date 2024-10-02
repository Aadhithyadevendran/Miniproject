import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       required: true
    }, 
    exam: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    macID: {
        type: String,
        required: true
    },
    roomNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    slot: {
        type: String,
        required: true
    }
}, {timestamps: true});

const SlotBooking = mongoose.model("SlotBooking", slotSchema);

export default SlotBooking;