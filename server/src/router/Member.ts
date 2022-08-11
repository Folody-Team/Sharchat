import {Router} from "express"
import {MemberController} from "../controller/Member"

const MemberRouter = Router()

MemberController.SetupRouter(MemberRouter)

export default MemberRouter
