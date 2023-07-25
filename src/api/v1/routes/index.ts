import {Router} from 'express'
const router: Router = Router()
import authRouter from './auth'
import nftsRouter from './nfts'
import oauthRouter from './oauth'

router.use('/auth', authRouter)
router.use('/oauth', oauthRouter)
router.use('/nfts', nftsRouter)

export default router