const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.json({message: 'Unauthorized'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        next();
    } catch(err) {
        res.json({message: err.message})
    }
}

module.exports = authMiddleware;