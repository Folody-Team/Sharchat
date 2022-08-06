import {Router} from "express"
import {CreateGuild, DeleteGuild} from "../controller/Guild"

const GuildRouter = Router()

GuildRouter.post('/create', CreateGuild)
GuildRouter.delete('/delete', DeleteGuild)

export default GuildRouter
