import {Router} from 'express'
import {JoinGuild, LeaveGuild} from '../controller/Member'

const MemberRouter = Router()

MemberRouter.post('/join', JoinGuild)
MemberRouter.delete('/leave', LeaveGuild)

export default MemberRouter
