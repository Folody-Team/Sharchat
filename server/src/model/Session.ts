import {getModelForClass, modelOptions, prop} from '@typegoose/typegoose'

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class Session {
	public _id: string

	@prop({required: true, default: Date.now(),expires: 60 * 60 * 24})
	public createdAt: Date

	@prop({required: true, default: Date.now()})
	public updatedAt: Date

	@prop({required: true})
	UserId: string
}

export const SessionModel = getModelForClass(Session)
