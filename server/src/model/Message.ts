import {getModelForClass, modelOptions, prop} from '@typegoose/typegoose'

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

	@prop({required: true})
	public User: string

	@prop({required: true})
	public Channel: string

	@prop({required: false})
	public threadId: string
}

export const MessageModel = getModelForClass(Message)
