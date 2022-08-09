import {Router} from "express"
import {GuildController} from "../controller/Guild"

const GuildRouter = Router()

GuildController.SetupRouter(GuildRouter)

export default GuildRouter
