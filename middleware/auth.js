const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({message: 'Unauthorized - No token provided'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        next();
    } catch(err) {
        res.status(401).json({message: 'Unauthorized - Invalid token'})
    }
}

module.exports = authMiddleware;