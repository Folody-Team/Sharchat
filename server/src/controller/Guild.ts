import {Request} from 'express'
import {GuildModel} from '../model/Guild'
import {Response} from '../typings/ResponseInput'

export const CreateGuild = async (req: Request, res: Response) => {
	const {name, description} = req.body
	if (!name || !description) {
		res.status(400).json({
			message: 'Missing required fields',
		})
		return
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

export const DeleteGuild = async (req: Request, res: Response) => {
	const {id} = req.body
	if (!id) {
		res.status(400).json({
			message: 'Missing required fields',
		})
		return
	}

	try {
		const guild = await GuildModel.findById(id)
		if (!guild) {
			res.status(400).json({
				message: 'Guild not found',
			})
			return
		}
		if (guild?.owner?.toString() !== res.locals.userId) {
			res.status(403).json({
				message: 'Requested user not the guild owner',
			})
			return
		}
		await guild.delete()
		res.status(200).send({
			message: 'Guild deleted',
		})
	} catch (error) {
		res.status(500).json({
			message: 'Error creating guild',
		})
	}
}
