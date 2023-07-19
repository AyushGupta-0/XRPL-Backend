import { Server } from 'socket.io';
import ApiRequest from '../interfaces/ApiRequest';
import { Request, Response } from 'express';

const linkSocketio = (io: Server) => {
    return (req: Request, res: Response, next: (err?: unknown)=> void) => {
        (req as ApiRequest).io = io;
        next();
    }
}

export default linkSocketio;