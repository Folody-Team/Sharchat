import {Router} from 'express'
import {RegisterUser} from '../controller/User'

const UserRouter = Router()

UserRouter.post('/register', RegisterUser)

export default UserRouter
