import {Router} from 'express'
import { UserController } from '../controller/User'

const UserRouter = Router()

UserController.SetupRouter(UserRouter)

export default UserRouter
