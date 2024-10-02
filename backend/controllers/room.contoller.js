import Room from "../models/room.model.js";

export const createRoom = async (req, res) => {
    try {
        const {roomNumber, roomCapacity, roomType} = req.body;
        const room = new Room({roomNumber, roomCapacity, roomType});
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("error in createRoom controller");
    }
}

export const editRoom = async (req, res) => {
    const {roomNumber, roomCapacity, roomType} = req.body;
    try{
        const room = await Room.findByIdAndUpdate(req.params.id, {roomNumber, roomCapacity, roomType});
        res.status(200).json(room);
    }
    catch (error) {
        res.status(500).json({message: error.message});
        console.log("error in editRoom controller");
    }
}

export const closeRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, {isClosed: true});
        res.status(200).json(room);
        console.log("success");
    }
    catch (error) {
        res.status(500).json({message: error.message});
        console.log("error in closeRoom controller");
    }
}

export const openRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, {isClosed: false});
        res.status(200).json(room);
    }
    catch {
        res.status(500).json({message: error.message});
        console.log("error in openRoom controller");
    }
}