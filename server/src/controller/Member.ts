import {Request} from 'express'
import {MemberUtil} from '../util/Member'
import {MemberModel} from '../model/Member'
import {GuildModel} from '../model/Guild'
import {Response} from '../typings/ResponseInput'

export const JoinGuild = async (req: Request, res: Response) => {
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
            guildId: guild._id
		})

        if(member) {
            res.status(200).send({
                message: "Requested user already joined the guild"
            })
            return;
        }

        member = await MemberUtil.CreateMember(guild._id, res.locals.userId, {
            isOwner: false
        })

        guild.members.push(member.userId)
        await guild.save();

        res.status(201).send({
            message: "Joined guild"
        })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Error joining guild',
		})
	}
}
