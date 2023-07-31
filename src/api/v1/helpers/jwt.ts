import jwt from 'jsonwebtoken';

// Generate JWT token (Probably no longer needed as we are using express-session)
const generateToken = (payload: any) => {
    let token: string = jwt.sign(payload, process.env.SECRET as string);
    return token;
}

export default generateToken;