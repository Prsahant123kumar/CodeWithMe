const mongoose = require("mongoose");

const PlatFormUserName = new mongoose.Schema(
    {
        leetcode: {
            type: String,
            default: "",
        },
        codeforces: {
            type: String,
            default: "",
        },
        codechef: {
            type: String,
            default: "",
        },
        codingNinja: {
            type: Boolean,
            default: "",
        },
        HackerEarth: {
            type: Boolean,
            default: "",
        },

        UserInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Information" }],

    },
    { timestamps: true }
);

const UserName = mongoose.model("UserName", PlatFormUserName);

module.exports = {UserName};
