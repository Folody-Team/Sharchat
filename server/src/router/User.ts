import {Router} from 'express'
import {RegisterUser, LoginUser} from '../controller/User'

const UserRouter = Router()

UserRouter.post('/register', RegisterUser)
UserRouter.post('/login', LoginUser)

export default UserRouter
