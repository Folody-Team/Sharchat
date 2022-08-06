import {getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose'
import { Guild } from './Guild'

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

	@prop({ required: true, default: [] })
	public guilds: Ref<Guild>[]

}

export const UserModel = getModelForClass(User)
