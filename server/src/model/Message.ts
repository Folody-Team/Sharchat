import {getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose'
import { Channel } from './Channel'
import { User } from './User'

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Message {
	public _id: string

	@prop({required: true, default: Date.now()})
	public createdAt: Date

	@prop({required: true, default: Date.now()})
	public updatedAt: Date

	@prop({required: true,ref: () => User})
	public User: Ref<User>

	@prop({required: true, ref: () => Channel})
	public Channel: Ref<Channel>

	@prop({required: false})
	public threadId: string
}

export const MessageModel = getModelForClass(Message)
