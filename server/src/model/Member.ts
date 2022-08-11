import {getModelForClass, modelOptions, prop} from '@typegoose/typegoose'
import permissions from '../configuration/permissions'

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Member {
	public _id: string

	@prop({required: true, default: Date.now()})
	public joinedAt: Date

	@prop({required: true, default: Date.now()})
	public updatedAt: Date

	@prop({requied: true})
	public userId: string

	@prop({requied: true})
	public guildId: string

	@prop({required: true, default: []})
	public permissions: Array<keyof typeof permissions>

	@prop({default: false})
	public isOwner: boolean
}

export const MemberModel = getModelForClass(Member)
