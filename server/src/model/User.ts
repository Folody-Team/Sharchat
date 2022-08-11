import {getModelForClass, modelOptions, prop} from '@typegoose/typegoose'

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
export class User {
	@prop({required: true})
	public username: string

	@prop({required: true})
	public password: string

	@prop({required: true})
	public email: string

	public _id: string

	@prop({required: true, default: Date.now()})
	public createdAt: Date

	@prop({required: true, default: Date.now()})
	public updatedAt: Date

	@prop({required: true, default: []})
	public guilds: string[]
}

export const UserModel = getModelForClass(User)
