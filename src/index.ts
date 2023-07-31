import dotenv from 'dotenv'
dotenv.config()
import express, {Express} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from "http";
import { Server } from "socket.io";
import linkSocketio from './api/v1/middlewares/linkSocketio';
import apiRouter from './api/v1/routes/index'
import passport from './api/v1/services/passport'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import db from './api/v1/helpers/firebase';
import { FirestoreStore } from '@google-cloud/connect-firestore';

// App Config
const app: Express = express()
const server = createServer(app)
const PORT = process.env.SERVER_PORT || 5000
const io: Server = new Server(server, {
    cors: {
        origin: '*',
    }
})

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(linkSocketio(io))
app.use(cookieParser())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    session({
        store: new FirestoreStore({
            dataset: db,
            kind: 'express-sessions',
        }),
        name: 'SESSION_COOKIE',
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 3,
            sameSite: false,
            httpOnly: true,
            // secure: true
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use('/api', apiRouter)

server.listen(PORT, () => console.log(`Server started on port ${PORT}.`))