import express from 'express';
import userCtrl from '../controllers/userCtrl.js';

const userRouter = express.Router();

userRouter.get('/me', userCtrl.getCurrentUser);

userRouter.post('/update-profile', userCtrl.updateProfile);

userRouter.post('/follow', userCtrl.follow);

userRouter.post('/unfollow', userCtrl.unfollow);

userRouter.get('/search', userCtrl.search);

userRouter.get('/:username', userCtrl.getUserInfo);

export default userRouter;
