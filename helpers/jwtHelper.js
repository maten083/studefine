const jwt = require("jsonwebtoken");

class JwtHelper {
    static generateToken(object) {
        return jwt.sign(object, process.env.TOKEN_SECRET);
    }

    static verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
                if (err) reject(err);

                resolve(user)
            })
        });
    }
}

module.exports = { JwtHelper }