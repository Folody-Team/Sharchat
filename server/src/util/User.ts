import jsonwebtoken from 'jsonwebtoken'
import {SessionModel} from '../model/Session'

const jwtSecret = process.env.JWT_SECRET

interface JwtPayload {
	sessionId: string
}



export const UserUtil = {
	GenToken: async (userId: string) => {
		if (!jwtSecret) {
			throw new Error('JWT_SECRET is not defined')
		}
		const Session = new SessionModel({
			UserId: userId,
		})
		await Session.save()
		const payload: JwtPayload = {
			sessionId: Session._id,
		}
		return jsonwebtoken.sign(payload, jwtSecret, {expiresIn: '1d'})
    },
    VerifyToken: async (token: string) => {
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined')
        }
		const payload = jsonwebtoken.verify(token, jwtSecret) as JwtPayload
		if (!payload) {
			return new Error('Invalid token')
		}
        const session = await SessionModel.findById(payload.sessionId)
        if (!session) {
            return new Error('Invalid token')
        }
        return session.UserId
    }

}
