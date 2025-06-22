const jwt = require('jsonwebtoken');

const generateToken = (res, user) => {
    if (!user || !user._id) {
        throw new Error("User object is missing or does not have an _id");
    }

    const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
    });
    console.log(token,"token")
    return token;
};

module.exports = generateToken;
