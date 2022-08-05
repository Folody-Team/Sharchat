import {getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose'
import {Guild} from './Guild'
import {User} from './User'

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Channel {
	public _id: string

	@prop({required: true, default: Date.now()})
	public createdAt: Date

	@prop({required: true, default: Date.now()})
	public updatedAt: Date

	@prop({required: true})
	public name: string

	@prop({required: true})
	public description: string

	@prop({required: true, ref: () => Guild})
	public guild: Ref<Guild>

	@prop({required: true, ref: () => User})
	public owner: Ref<User>
}

export const ChannelModel = getModelForClass(Channel)
