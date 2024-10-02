import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../lib/utils/generateTokenAndSetCookie.js"
import User from "../models/user.model.js";

export const signup = async (req, res) => {
    try{
        const {username, email, password, role, name, contact, department, registerNumber} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            name,
            contact,
            department,
            registerNumber
        })
        await user.save();
        res.status(201).json({ success: true, message: "User created successfully" });

        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            success: true,
            _id: newUser._id,
            username: newUser.username,
            fullName: newUser.fullName,
            email: newUser.email,
        });

    }
    catch(error) {
        console.error(`error in signup controller: ${error.message}`);
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({success: false, message: "user not found"});
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ success: false, message: "Invalid password" });
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            success: true,
            _id: user._id,
            message: `logged in as ${user.role}`
        })
        
    } catch (error) {
        console.log(`error in login controller: ${error.message}`);
        
    }
}

export const logout = async (req, res) => {
    try{
        res.cookie("jwt","",{ maxAge: 0})
        res.status(201).json({message: "logged out successfully"})
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};


