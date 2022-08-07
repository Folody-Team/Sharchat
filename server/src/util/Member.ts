import {MemberModel} from '../model/Member'
import {UserModel} from '../model/User'
import {GuildModel} from '../model/Guild'
import path from 'path'
import dotenv from 'dotenv'

import permissions from '../configuration/permissions'

interface CheckPermissionsOptions {
	some?: Array<keyof typeof permissions> | null
	every?: Array<keyof typeof permissions> | null
	isOwner?: true | false | null
}

dotenv.config({
	path: path.join(__dirname, '..', '..', '.env'),
})

interface CreateMemberOption {
	isOwner: boolean
}

export const MemberUtil = {
	CreateMember: async (
		guildId: string | undefined,
		userId: string | undefined,
		options: CreateMemberOption
	) => {
		if (!guildId || !userId) {
			throw new Error('Guild ID/User ID is not provided')
		}

		if(!options.isOwner) options.isOwner = false

		const user = await UserModel.findById(userId)
		if (!user) {
			throw new Error('User not found')
		}

		const guild = await GuildModel.findById(guildId)
		if (!guild) {
			throw new Error('Guild not found')
		}

		const member = new MemberModel({
			userId: user._id,
			guildId: guild._id,
			permissions: [],
			...options,
		})
		await member.save()
		return member
	},
	DeleteMember: async (
		guildId: string | undefined,
		userId: string | undefined,
	) => {
		if (!userId) {
			throw new Error('Guild ID/User ID is not provided')
		}

		const user = await UserModel.findById(userId)
		if (!user) {
			throw new Error('User not found')
		}

		const member = await MemberModel.findOne({
			userId: user._id,
			guildId: guildId
		})
		if(!member) {
			throw new Error('Member not found')
		}
		await member.delete()
		return member
	},
	CheckPermissions: async (
		userId: string | undefined,
		guildId: string,
		{some, every, isOwner}: CheckPermissionsOptions
	) => {
		if (!userId || !guildId) {
			throw new Error('User ID/Guild ID is not provided')
		}

		const user = await UserModel.findById(userId)

		if (!user) {
			throw new Error('User not found')
		}

		const guild = await GuildModel.findById(guildId)

		if (!guild) {
			throw new Error('Guild not found')
		}

		const member = await MemberModel.findOne({
			userId: user._id
		})

		if (!member) {
			throw new Error('Member not found')
		}

		let result: {
			permissions: Array<keyof typeof permissions>
			some?: boolean
			every?: boolean
			isOwner?: boolean
		} = {
			permissions: member.permissions,
		}

		if (some || every || isOwner) {
			result.some = member.permissions.some((perm) => some?.includes(perm))
			result.every = member.permissions.every((perm) => every?.includes(perm))
			result.isOwner = member.isOwner
		}
		return result
	},
}
