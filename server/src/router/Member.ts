import {Router} from "express"
import {JoinGuild} from "../controller/Member"

const MemberRouter = Router()

MemberRouter.post('/join', JoinGuild)

export default MemberRouter
