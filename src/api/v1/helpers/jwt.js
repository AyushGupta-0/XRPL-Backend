const jwt = require("jsonwebtoken");

module.exports = {
    generateToken: async (payload) => {
        let token = await jwt.sign(payload, process.env.SECRET);
        return token;
    },
}