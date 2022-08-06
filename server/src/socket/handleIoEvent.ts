import {Server} from 'socket.io'
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from './SocketServerEvent'
import {UserUtil} from '../util/User'
import {DefaultEventsMap} from 'socket.io/dist/typed-events'

export class HandleEvent {
	socket: Server<
		ServerToClientEvents,
		ClientToServerEvents,
		DefaultEventsMap,
		SocketData
	>
	constructor(
		socket: Server<
			ServerToClientEvents,
			ClientToServerEvents,
			DefaultEventsMap,
			SocketData
		>
	) {
		this.socket = socket
		this.AddEvent()
	}
	AddEvent() {
		this.socket.on('connection', (socket) => {
			console.log('new socket connection with id: ' + socket.id)
			socket.on('disconnect', () => {
				console.log('socket disconnected with id: ' + socket.id)
			})
		})
	}
	SetupMiddleware() {
		this.socket.use(async (socket, next) => {
			const token = socket.handshake.auth.token
			if (!token) {
				return next(new Error('Authentication error'))
			}
			const userId = await UserUtil.VerifyToken(token)
			if (!userId) {
				return next(new Error('Authentication error'))
			}
			if (userId instanceof Error) {
				return next(userId)
			}
			socket.data.UserId = userId
		})
	}
}
