import { admin, auth } from '../middleware/index.js';
import adminRouter from './adminRoute.js';
import authRouter from './authRoute.js';
import commentRouter from './commentRoute.js';
import notificationRouter from './notificationRoute.js';
import postRouter from './postRoute.js';
import userRouter from './userRoute.js';

const initRoutes = (app) => {
  app.use('/api/auth', authRouter);
  app.use('/api/users', auth, userRouter);
  app.use('/api/posts', auth, postRouter);
  app.use('/api/comments', auth, commentRouter);
  app.use('/api/notification', auth, notificationRouter);
  app.use('/api/admin', admin, adminRouter);
};

export default initRoutes;
