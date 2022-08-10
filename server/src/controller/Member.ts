import {Request} from 'express'
import {MemberUtil} from '../util/Member'
import {MemberModel} from '../model/Member'
import {GuildModel} from '../model/Guild'
import {Response} from '../typings/ResponseInput'
import {Controller, ControllerType} from '../typings/ControllerType'

export const JoinGuild: ControllerType<true> = async (req: Request, res: Response<true>) => {
	const id = req.body.id
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

		let member = await MemberModel.findOne({
			userId: res.locals.userId,
			guildId: guild._id,
		})

		if (member) {
			res.status(200).send({
				message: 'Requested user already joined the guild',
			})
			return
		}

		member = await MemberUtil.CreateMember(guild._id, res.locals.userId, {
			isOwner: false,
		})

		guild.members.push(member.userId)
		await guild.save()

		res.status(201).send({
			message: 'Joined guild',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Error joining guild',
		})
	}
}

JoinGuild.ControllerName = "join"
JoinGuild.RequestMethod = "post"
JoinGuild.RequestBody = {
	id: "string"
}

export const LeaveGuild: ControllerType<true> = async (req: Request, res: Response<true>) => {
	const id = req.body.id
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

		let member = await MemberModel.findOne({
			userId: res.locals.userId,
			guildId: guild._id,
		})

		if (!member) {
			res.status(200).send({
				message: "Requested user isn't in the guild",
			})
			return
		}

		if (member.userId == guild.owner) {
			res.status(403).send({
				message: "Guild owner can't leave guild, transfer or delete it instead",
			})
			return
		}

		member = await MemberUtil.DeleteMember(guild._id, res.locals.userId)

		const newGuildMembers = guild.members.filter((m) => m !== res.locals.userId)
		guild.members = newGuildMembers
		await guild.save()

		res.status(200).send({
			message: 'Left guild',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Error leaving guild',
		})
	}
}

LeaveGuild.ControllerName = "leave",
LeaveGuild.RequestMethod = "delete",
LeaveGuild.RequestBody = {
	id: "string"
}

export const RemoveMember: ControllerType<true> = async (req: Request, res: Response<true>) => {
	const userId = req.body.userId
	const guildId = req.body.guildId
	if (!userId || !guildId) {
		res.status(400).json({
			message: 'Missing required fields',
		})
		return
	}

	try {
		const guild = await GuildModel.findById(guildId)
		if (!guild) {
			res.status(400).json({
				message: 'Guild not found',
			})
			return
		}

		const requested = await MemberModel.findOne({
			userId: res.locals.userId,
			guildId: guild._id,
		})

		if (!requested) {
			res.status(403).send({
				message: "Requested user isn't in the guild",
			})
			return
		}

		if (
			!requested.permissions.find((v) => v == 'admin' || v == 'moderator') &&
			!requested.isOwner &&
			requested.userId !== guild.owner
		) {
			res.status(403).send({
				message: 'Missing permissions',
			})
			return
		}

		let member = await MemberModel.findOne({
			userId: userId,
			guildId: guild._id,
		})

		if (!member) {
			res.status(403).send({
				message: "Can't find valid user with the provided ID in the guild",
			})
			return
		}

		if (
			member.permissions.find((v) => v == 'admin' || v == 'moderator') ||
			member.isOwner ||
			member.userId == guild.owner
		) {
			res.status(403).send({
				message:
					"You can't remove this member from the guild. They are Admin, Moderator or Server Owner",
			})
			return
		}

		member = await MemberUtil.DeleteMember(guild._id, userId)

		const newGuildMembers = guild.members.filter((m) => m !== userId)
		guild.members = newGuildMembers
		await guild.save()

		res.status(200).send({
			message: 'Removed member from the guild',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Error leaving guild',
		})
	}
}

RemoveMember.ControllerName = "remove",
RemoveMember.RequestMethod = "delete",
RemoveMember.RequestBody = {
	userId: "string",
	guildId: "string"
}

export const MemberController = new Controller([
	JoinGuild,
	LeaveGuild,
	RemoveMember,
])