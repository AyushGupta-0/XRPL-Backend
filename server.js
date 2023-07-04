const express = require('express')
const xrpl = require('xrpl')
const cors = require('cors')
const helmet = require('helmet')
const linkSocketio = require('./middlewares/linkSocketio')
require('dotenv').config()

// App Config
const app = express()
const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})
// Middlewares
app.use(cors())
app.use(linkSocketio(io))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const PORT = process.env.SERVER_PORT || 5000


// Routers
const authRouter = require('./router/authRouter')
const nftRouter = require('./router/nftRouter')
app.use('/api/auth', authRouter)
app.use('/api/nfts', nftRouter)

io.listen(process.env.SOCKETIO_PORT)
app.listen(PORT, () => console.log(`Server started on port ${PORT}. Socket started on port ${process.env.SOCKETIO_PORT}`))