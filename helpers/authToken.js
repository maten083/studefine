const { JwtHelper } = require("./jwtHelper");

module.exports = async (req, res, next) => {

    // cookei
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return res.sendStatus(403);

    const token = authHeader.split(' ')[1];

    if (typeof token === 'undefined' || token === null)
        return res.sendStatus(403);

    JwtHelper.verifyToken(token).then(user => {
        req.user = user;
        next();
    }).catch(() => {
        res.sendStatus(403);
    })
}