import {Request} from 'express'
import { MemberUtil } from '../util/Member'
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
		const guild = await (new GuildModel({
			name,
			description,
			owner: res.locals.userId,
		})).save()
		
		const member = await MemberUtil.CreateMember(
			guild._id,
			res.locals.userId,
			{
				isOwner: true
			}
		)

		guild.members.push(member)

		await guild.save()

		res.status(201).json({
			message: 'Guild created',
			guild,
		})
	} catch (error) {
		console.log(error)
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
		const result = await MemberUtil.CheckPermissions(
			res.locals.userId,
			guild._id,
			{
				isOwner: true
			}
		)
		if(!result.isOwner) {
			res.status(403).send({
				message: 'Requested user is not the guild owner'
			})
			return;
		}

		try {
			await MemberUtil.DeleteMember(guild._id, res.locals.userId)
		} catch(err) {}

		await guild.delete()

		res.status(200).send({
			message: 'Guild deleted',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Error deleting guild',
		})
	}
}

export const EditGuild = async (req: Request, res: Response) => {
	const {id, name, description} = req.body
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
		const result = await MemberUtil.CheckPermissions(
			res.locals.userId,
			guild._id,
			{
				isOwner: true,
			}
		)
		if (
			!result.isOwner &&
			!result.permissions.includes('admin') &&
			!result.permissions.includes('server_manager')
		) {
			res.status(403).send({
				message: "Requested member doesn't have permission to edit",
			})
			return
		}

		if (
			(name && typeof name == 'string') ||
			(description && typeof description == 'string')
		) {
			if (name && typeof name == 'string') guild.name = name
			if (description && typeof description == 'string')
				guild.description = description

			await guild.save()
		}

		res.status(200).send({
			message: 'Guild edited',
			guild,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Error editing guild',
		})
	}
}
