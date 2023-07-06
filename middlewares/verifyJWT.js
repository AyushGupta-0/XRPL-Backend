const db = require('../utils/firebase')
const jwt = require("jsonwebtoken");

module.exports = {
    verifyToken: (req, res, next) => {
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== "undefined") {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(req.token, process.env.SECRET, (err, authData) => {
                if (err) {
                    res.status(400).json({
                        status: "failed",
                        msg: "Invalid Token",
                    });
                } else {
                    if(Date.now() > authData.expiry){
                        res.status(401).json({
                            status: "failed",
                            msg: "Token Expired",
                        });
                    }else{
                        db.collection('users').doc(authData.address).get().then((doc) => {
                            if(doc.exists){
                                req.user = doc.data()
                                next()
                            }else{
                                res.status(404).json({
                                    status: "failed",
                                    msg: "User does not exist",
                                });
                            }
                        })
                    }
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