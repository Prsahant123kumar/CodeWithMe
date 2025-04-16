const mongoose = require("mongoose");

const TempAuthSchema = new mongoose.Schema(
    {
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

const DemoUserAuth = mongoose.model("DemoUserAuth", TempAuthSchema);

module.exports = {DemoUserAuth};
