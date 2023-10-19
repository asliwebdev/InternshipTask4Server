require('dotenv').config();
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) {
        return res.status(401).json({ message: 'Authorization denied. Token is missing.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET_KEY);
        req.user = decoded.user;
        next()
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized user!.' });
    }

}

module.exports = authMiddleware;