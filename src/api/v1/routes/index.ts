import {Router} from 'express'
const router: Router = Router()
import authRouter from './auth'
import nftsRouter from './nfts'
import userRouter from './user'

router.use('/auth', authRouter)
router.use('/nfts', nftsRouter)
router.use('/user', userRouter)

router.get('/', (req, res) => {
    res.json({status: 'success', message: 'Welcome to the NFT Marketplace API'})
})

export default router