import {Router} from "express"
import {CreateGuild, DeleteGuild, EditGuild} from "../controller/Guild"

const GuildRouter = Router()

GuildRouter.post('/create', CreateGuild)
GuildRouter.delete('/delete', DeleteGuild)
GuildRouter.patch('/edit', EditGuild)

export default GuildRouter
