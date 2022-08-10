/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {NextFunction, Request} from 'express'
import {Response} from './ResponseInput'
import type {Router} from 'express'

export interface ControllerType<auth = false, TResponse = unknown> {
	(req: Request, res: Response<auth, TResponse>, next: NextFunction):
		| Promise<unknown>
		| unknown
		| void
		| Promise<void>
	RequestBody?: {
		[key: string]:
			| any
			| {
					optional?: boolean
					type?: any
			  }
	}
	RequestQuery?: {
		[key: string]:
			| any
			| {
					optional?: boolean
					type?: any
			  }
	}
	ControllerName: string
	RequestMethod?: 'get' | 'post' | 'put' | 'delete' | 'patch'
}

export class Controller {
	controllers: Map<string, ControllerType>
	constructor(public controller: ControllerType[]) {
		this.controllers = new Map<string, ControllerType>()
		for (const c of controller) {
			this.controllers.set(c.ControllerName, c)
		}
	}
	SetupRouter(router: Router) {
		for (const [name, controller] of this.controllers) {
			router[controller.RequestMethod || 'post'](
				`/${name}`,
				this.checkRequestBody.bind(this),
				this.checkRequestQuery.bind(this),
				controller
			)
		}
	}
	checkRequestBody(req: Request, res: Response<false>, next: NextFunction) {
		req.url = req.protocol + '://' + req.get('host') + req.originalUrl;
		const controller = this.controllers.get(
			new URL(req.url).pathname.split('/')[2]
		)
		if (!controller) {
			res.status(400).json({
				message: 'Controller not found',
			})
			return
		}
		if (controller.RequestBody) {
			const RequestBody: {
				[key: string]: any
			} = {}
			for (const key in controller.RequestBody) {
				if (!req.body[key] && !controller.RequestBody[key].optional) {
					res.status(400).json({
						message: 'Missing required fields',
					})

					return
				}

				if (
					!checkType(controller.RequestBody[key], req.body[key]) &&
					!controller.RequestBody[key].optional
				) {
					res.status(400).json({
						message: 'Missing required fields',
					})
					return
				}
				RequestBody[key] = req.body[key]
			}
			req.body = RequestBody
		}
		next()
	}
	checkRequestQuery(req: Request, res: Response<false>, next: NextFunction) {
		req.url = req.protocol + '://' + req.get('host') + req.originalUrl;
		const controller = this.controllers.get(
			new URL(req.url).pathname.split('/')[2]
		)
		if (!controller) {
			res.status(400).json({
				message: 'Controller not found',
			})
			return
		}
		if (controller.RequestQuery) {
			for (const key in controller.RequestQuery) {
				if (!req.query[key]) {
					res.status(400).json({
						message: 'Missing required fields',
					})

					return
				}
				if (!checkType(controller.RequestQuery[key], req.query[key])) {
					res.status(400).json({
						message: 'Missing required fields',
					})
					return
				}
			}
		}
		next()
	}
}

function checkType(type:
	"array"
	| "number"
	| "string"
	| "object",
value: any) {
	if(type == "array") return Array.isArray(value)
	return typeof value == type
}