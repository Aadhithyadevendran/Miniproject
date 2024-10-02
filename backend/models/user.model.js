import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "student"],
        default: "student"
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "default.jpg"
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    registerNumber: {
        type: String,
        required: true,
        unique: true
    },
}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;