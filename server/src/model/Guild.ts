import {getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose'
import { Channel } from './Channel'
import { Member } from './Member'
import {User} from './User'

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Guild {
	public _id: string

	@prop({required: true, default: Date.now()})
	public createdAt: Date

	@prop({required: true, default: Date.now()})
	public updatedAt: Date

	@prop({required: true})
	public name: string

	@prop({required: true})
	public description: string

	@prop({required: true, ref: () => User})
	public owner: Ref<User>

    @prop({ required: true, default: [] })
    public members: Ref<Member>[]

    @prop({ required: true, default: [] })
    public channels: Ref<Channel>[]
}

export const GuildModel = getModelForClass(Guild)
