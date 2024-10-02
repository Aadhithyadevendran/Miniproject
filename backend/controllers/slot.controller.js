import Room from "../models/room.model.js";
import SlotBooking from "../models/slot.model.js";
import User from "../models/user.model.js";

export const bookSlot = async (req, res) => {
    try{
        const {userId, exam, courseCode, courseName, macID, roomNumber, Date, slot} = req.body;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const room = await Room.findOne({roomNumber});
        if(!room) {
            return res.status(404).json({message: "Room not found"});
        }
        const slotBooking = new SlotBooking({
            userId: userId,
            exam,
            courseCode,
            courseName,
            macID,
            roomNumber,
            Date,
            slot
        });
        await slotBooking.save();
        res.status(201).json({message: "Slot booked successfully"});   
    }
    catch (error) {
        console.error(`error booking slot: ${error.message}`);
    }
}
export const editSlot = async (req, res) => {
    try{
        const {userId, exam, courseCode, courseName, macID, roomNumber, Date,slot} = req.body;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const slotBooking = await SlotBooking.findOneAndUpdate({userId: userId}, {
            exam,
            courseCode,
            courseName,
            macID,
            roomNumber,
            Date,
            slot
        });
        res.status(200).json({message: "Slot updated successfully"});
    }
    catch (error) {
        console.error(`error editing slot: ${error.message}`);
    }
}
