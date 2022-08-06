import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
	HandleEvent,
} from './socket'
import UserRouter from './router/User'
import GuildRouter from './router/Guild'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import dotenv from 'dotenv'
import {DefaultEventsMap} from 'socket.io/dist/typed-events'
import {AuthMiddleware} from './middleware/auth'
dotenv.config({
	path: path.join(__dirname, '..', '.env'),
})

const app = express()
app.use(cors())
app.use(express.json())
const HttpServer = http.createServer(app)
const io = new Server<
	ServerToClientEvents,
	ClientToServerEvents,
	DefaultEventsMap,
	SocketData
>(HttpServer)
new HandleEvent(io)

if (!process.env.DB_URL) {
	throw new Error('DB_URL is not defined')
}

mongoose.connect(process.env.DB_URL, {})

app.use('/user', UserRouter)
app.use('/guild', AuthMiddleware, GuildRouter)

HttpServer.listen(3000, () => {
	console.log('Server listening on port 3000')
})
