const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, '324324ui24hkb2k4b231k4k12kkfbdkbi24bib21');
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            msg: 'Auth Failed'
        })
    }
}