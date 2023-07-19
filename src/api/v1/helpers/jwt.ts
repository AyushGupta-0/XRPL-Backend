import jwt from 'jsonwebtoken';

const generateToken = (payload: any) => {
    let token: string = jwt.sign(payload, process.env.SECRET as string);
    return token;
}

export default generateToken;