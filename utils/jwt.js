module.exports = {
    generateToken: async (payload) => {
        let token = await jwt.sign(payload, process.env.SECRET);
        return token;
    },
    verifyToken: (req, res, next) => {
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== "undefined") {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(req.token, process.env.SECRET, (err, authData) => {
                if (err) {
                    console.log(err);
                } else {
                    // TODO: Verify auth data. Pending discussion on auth
                    console.log(authData);
                }
            });
        } else {
            res.status(403).json({
                status: "failed",
                msg: "No Access Token Provided",
            });
        }
    },
}