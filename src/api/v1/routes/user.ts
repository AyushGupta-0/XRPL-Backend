import { Router } from 'express'
import { getProfile, getPublicProfile } from '../controllers/user'
import {verifyAccount, verifyCompleteAccount} from '../middlewares/verifyJWT'
const router: Router = Router()


// @route     GET /v1/user/profile
// @desc      Get user profile details
// @access    Private
router.get('/profile', verifyAccount, getProfile)

// @route     GET /v1/user/profile/:username
// @desc      Get user profile details
// @access    Public
router.get('/profile/:username', getPublicProfile)

export default router