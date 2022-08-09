import {Router} from 'express'
import {JoinGuild, LeaveGuild, RemoveMember} from '../controller/Member'

const MemberRouter = Router()

MemberRouter.post('/join', JoinGuild)
MemberRouter.delete('/leave', LeaveGuild)
MemberRouter.delete('/remove', RemoveMember)

export default MemberRouter
