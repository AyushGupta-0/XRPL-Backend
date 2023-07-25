import { NextFunction, Response } from "express";
import ApiRequest from "../interfaces/ApiRequest";
import db from "../helpers/firebase";

const checkAuthentication = (req: ApiRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.SESSION_COOKIE;
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    db.collection('users').where("token", "==", token).get().then((snapshot) => {
        if (snapshot.empty) {
            return res.status(401).json({ message: 'Unauthorized' });
        } else {
            req.user = snapshot.docs[0].data();
            next();
        }
    }).catch((err) => {
        return res.status(401).json({ message: 'Unauthorized' });
    })
}

export default checkAuthentication