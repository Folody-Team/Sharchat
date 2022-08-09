import {GuildModel} from '../model/Guild'
import {MemberModel} from '../model/Member'
import {Controller, ControllerType} from '../typings/ControllerType'
import {MemberUtil} from '../util/Member'

export const CreateGuild: ControllerType<true> = async (req, res) => {
	const {name, description} = req.body
	if (!name || !description) {
		res.status(400).json({
			message: 'Missing required fields',
		})
		return
	}

	try {
		const guild = await new GuildModel({
			name,
			description,
			owner: res.locals.userId,
		}).save()

		const member = await MemberUtil.CreateMember(guild._id, res.locals.userId, {
			isOwner: true,
		})

		guild.members.push(member.userId)

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
CreateGuild.name = 'create'
CreateGuild.RequestMethod = 'post'
CreateGuild.RequestBody = {
	name: String,
	description: String,
}

export const DeleteGuild: ControllerType<true> = async (req, res) => {
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
				isOwner: true,
			}
		)
		if (!result.isOwner) {
			res.status(403).json({
				message: 'Requested user is not the guild owner',
			})
			return
		}

		try {
			const members = await MemberModel.find({
				guildId: guild._id,
			})
			members.map((d) => d.delete())
		} catch (err) {}

		await guild.delete()

		res.status(200).json({
			message: 'Guild deleted',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Error deleting guild',
		})
	}
}
DeleteGuild.name = 'delete'
DeleteGuild.RequestMethod = 'delete'
DeleteGuild.RequestBody = {
	id: String,
}

export const EditGuild: ControllerType<true> = async (req, res) => {
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
			res.status(403).json({
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

		res.status(200).json({
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
EditGuild.name = 'edit'
EditGuild.RequestMethod = 'patch'
EditGuild.RequestBody = {
	id: String,
	name: {
		type: String,
		optional: true,
	},
	description: {
		type: String,
		optional: true,
	},
}

export const GuildController = new Controller([
	CreateGuild,
	DeleteGuild,
	EditGuild,
])
