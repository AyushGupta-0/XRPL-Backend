import { Request } from 'express';
import { Server } from 'socket.io'

export default interface ApiRequest extends Request {
    user?: any,
    token?: string,
    io?: Server
}