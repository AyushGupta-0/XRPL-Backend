import {Router} from 'express'
const router: Router = Router()
import authRouter from './auth'
import nftsRouter from './nfts'

router.use('/auth', authRouter)
router.use('/nfts', nftsRouter)

export default router