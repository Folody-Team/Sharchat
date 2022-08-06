import {NextFunction, Request, Response} from 'express'
import {UserUtil} from '../util/User'

export const AuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers['authorization']
	if (!token) {
		return res.status(401).json({
			message: 'No token provided',
		})
	}
	try {
		const decoded = await UserUtil.VerifyToken(token)
		if (decoded instanceof Error) {
			return res.status(401).json({
				message: decoded.message,
			})
		}
		res.locals.userId = decoded
		return next()
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		})
	}
}
