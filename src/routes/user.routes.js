import { Router } from "express";

import { 
    changeCurrentUserPassword, 
    getCurrentUser, 
    getUserChannelProfile, 
    getWatchHistory, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {verifyJwt} from '../middlewares/auth.middlewares.js'

const router = Router();

router.route('/register')
    .post(upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        }
    ]), registerUser);

router.route('/login').post(loginUser)

//secured routes
router.route('/logout').post(verifyJwt, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/change-password').post(verifyJwt, changeCurrentUserPassword)
router.route('/current-user').get(verifyJwt, getCurrentUser)
router.route('/update-account').patch(verifyJwt, updateAccountDetails)

router.route('/update-avatar').patch(verifyJwt, upload.single("avatar"), updateUserAvatar)
router.route('/update-coverImage').patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage)

router.route('/channel/:username').get(verifyJwt, getUserChannelProfile)
router.route('/watchHistory').get(verifyJwt, getWatchHistory)


export default router