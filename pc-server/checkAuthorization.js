require('dotenv').config()
const jwt = require('jsonwebtoken');

module.exports = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(401).json({result: "Unauthorized access. Token not registered"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, passwd) =>{
        if (err) return res.status(403).json({result: "Unauthorized access. Token not valide"});
        req.passwd = passwd;
        next();
    });
}