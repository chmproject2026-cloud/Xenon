const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const tokenString = req.header('Authorization');
    if (!tokenString) return res.status(401).json("Access Denied!");

    // Extract token if it starts with "Bearer "
    const token = tokenString.startsWith("Bearer ") ? tokenString.slice(7).trim() : tokenString;

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json("Invalid Token!");
    }
};
