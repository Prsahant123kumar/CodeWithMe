const { UserAuth: User } = require("../models/UserAuth");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { generateVerificationCode } = require("../utils/generateVerificationCode");
const  generateToken  = require("../utils/generateToken");
const { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } = require("../mailtrap/email");
const { DemoUserAuth: TempUser } = require("../models/TempUserAuth");

const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log(fullName,email,password)
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        await TempUser.deleteOne({ email });
        // Generate OTP & Expiry
        const verificationToken = generateVerificationCode(); // e.g., 6-digit code
        const verificationTokenExpiresAt = Date.now() + 5 * 60 * 1000; // 10 min expiry

        // Store user details temporarily in Redis
        await TempUser.create({
            fullName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt
        });

        // Send OTP Email
        try {
            await sendVerificationEmail(email, verificationToken);
            return res.status(200).json({
                success: true,
                message: "Verification email sent. Please check your inbox."
            });
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: "Failed to send verification email"
            });
        }

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};




const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password",
            });
        }

        generateToken(res, user);
        user.lastLogin = new Date();
        await user.save();

        // Send user details without the password
        const userWithoutPassword = await User.findOne({ email }).select("-password");

        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const jwt = require("jsonwebtoken");

const verifyEmail = async (req, res) => {
    try {
        const { verificationCode } = req.body;

        if (!verificationCode) {
            return res.status(400).json({ success: false, message: "Verification code is required." });
        }

        // Find user with valid OTP in TempUser
        const tempUser = await TempUser.findOne({ 
            verificationToken: verificationCode,
            verificationTokenExpiresAt: { $gt: Date.now() } // Not expired
        });

        if (!tempUser) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification token." });
        }

        // Save verified user to the main User collection
        const newUser = await User.create({
            fullName: tempUser.fullName,
            email: tempUser.email,
            password: tempUser.password, // Already hashed
            isVerified: true
        });

        // Delete the TempUser entry
        await TempUser.deleteOne({ email: tempUser.email });

        // Send welcome email
        await sendWelcomeEmail(newUser.email, newUser.fullname);

        // ✅ Generate JWT token
        const token =generateToken(res, newUser);

        // ✅ Return user & token in response
        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user: {
                _id: newUser._id,
                fullname: newUser.fullName,
                email: newUser.email,
                isVerified: newUser.isVerified
            },
            token // Optional: only if frontend uses it
        });

    } catch (error) {
        console.error("Verify Email Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password`);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { id: email, password: newPassword } = req.body.take; // Extract email and new password
        const user = await User.findOne({ email }); // Find user by email
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword; // Assuming the password is hashed elsewhere
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const checkAuth = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        };
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = { signup, login, verifyEmail, logout, forgotPassword, resetPassword, checkAuth };
