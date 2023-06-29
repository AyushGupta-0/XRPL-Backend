const express = require('express')
const xrpl = require('xrpl')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

// App Config
const app = express()
const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})
const authRouter = require('./router/authRouter')(io)
const nftRouter = require('./router/nftRouter')(io)
const PORT = process.env.SERVER_PORT || 5000

// Middlewares
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Auth Router
app.use('/api/auth', authRouter)
app.use('/api/nft', nftRouter)

io.listen(process.env.SOCKETIO_PORT)
app.listen(PORT, () => console.log(`Server started on port ${PORT}. Socket started on port ${process.env.SOCKETIO_PORT}`))