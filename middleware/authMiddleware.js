const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Access denied' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Server configuration error' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = auth;
