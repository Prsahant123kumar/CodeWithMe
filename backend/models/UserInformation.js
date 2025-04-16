const mongoose = require("mongoose");

const InformationSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        College: {
            type: String,
        },
        Passing_Year: {
            type: Number,
        },
        profilePicture: {
            type: String,
            default: ""
        },
        Country: {
            type: String,
            required: true
        },
        authId: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserAuth" }],

    },
    { timestamps: true }
);

const Information = mongoose.model("Information", InformationSchema);

module.exports = {Information};
