import {Request, Response} from 'express'
import {UserModel} from '../model/User'

import bcrypt from 'bcrypt'
import {UserUtil} from '../util/User'
import {ControllerType, Controller} from '../typings/ControllerType'

export const RegisterUser: ControllerType = async (
	req: Request,
	res: Response
) => {
	const {email, password, username} = req.body
	if (!email || !password || !username) {
		return res.status(400).json({
			message: 'Please fill all the fields',
		})
	}

	try {
		const alreadyUser =
			(await UserModel.findOne({email: email})) ||
			(await UserModel.findOne({username: username}))
		if (alreadyUser) {
			return res.status(400).json({
				message: 'Username or email is already taken',
			})
		}

		const hashPassword = await bcrypt.hash(password, 10)
		const user = new UserModel({
			email,
			password: hashPassword,
			username,
		})
		await user.save()
		return res.status(201).json({
			message: 'User created successfully',
			token: await UserUtil.GenToken(user._id),
		})
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		})
	}
}
RegisterUser.ControllerName = 'register'
RegisterUser.RequestMethod = 'post'
RegisterUser.RequestBody = {
	email: "string",
	username: "string",
	password: "string",
}

export const LoginUser: ControllerType<false> = async (
	req: Request,
	res: Response
) => {
	const {emailOrUsername, password} = req.body
	if (!emailOrUsername || !password) {
		return res.status(400).json({
			message: 'Please fill all the fields',
		})
	}

	try {
		const user =
			(await UserModel.findOne({email: emailOrUsername})) ||
			(await UserModel.findOne({username: emailOrUsername}))
		if (!user) {
			return res.status(400).json({
				message: 'User not found',
			})
		}
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({
				message: 'Password is incorrect',
			})
		}
		return res.status(200).json({
			message: 'Login successfully',
			token: await UserUtil.GenToken(user._id),
		})
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		})
	}
}

LoginUser.ControllerName = 'login'
LoginUser.RequestMethod = 'post'
LoginUser.RequestBody = {
	emailOrUsername: "string",
	password: "string",
}

export const UserController = new Controller([RegisterUser, LoginUser])
