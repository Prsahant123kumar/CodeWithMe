const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
    {
        fullName: {
            type:String,
            required:true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        resetPasswordToken: String,
        resetPasswordTokenExpiresAt: Date,
        verificationToken: String,
        verificationTokenExpiresAt: Date
    },
    { timestamps: true }
);

const UserAuth = mongoose.model("UserAuth", AuthSchema);

module.exports = {UserAuth};
