const jwt = require('jsonwebtoken');

const generateToken = (res, user) => {
    const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'strict', // good for CSRF protection
        secure: process.env.NODE_ENV === "production", // true only on HTTPS
        maxAge: 24 * 60 * 60 * 1000,
    });

    return token;
};

module.exports = generateToken;
