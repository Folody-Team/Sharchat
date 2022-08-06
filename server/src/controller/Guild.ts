import {Request} from 'express'
import {GuildModel} from '../model/Guild'
import {Response} from '../typings/ResponseInput'

export const CreateGuild = async (req: Request, res: Response) => {
	const {name, description} = req.body
	if (!name || !description) {
		res.status(400).json({
			message: 'Missing required fields',
		})
	}
	try {
		const guild = new GuildModel({
			name,
			description,
			owner: res.locals.userId,
		})
		await guild.save()
		res.status(201).json({
			message: 'Guild created',
			guild,
		})
	} catch (error) {
		res.status(500).json({
			message: 'Error creating guild',
		})
	}
}
