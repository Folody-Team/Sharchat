import {getModelForClass, modelOptions, prop} from '@typegoose/typegoose'
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
	public owner: string

    @prop({ required: true, default: [] })
    public members: string[]

    @prop({ required: true, default: [] })
    public channels: string[]
}

export const GuildModel = getModelForClass(Guild)
