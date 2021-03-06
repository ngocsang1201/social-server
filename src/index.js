import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connectToDatabase } from './config/database.js';
import { socketServer } from './config/socket.js';
import admin from './middlewares/admin.js';
import auth from './middlewares/auth.js';
import adminRouter from './routes/adminRoute.js';
import authRouter from './routes/authRoute.js';
import chatRouter from './routes/chatRoute.js';
import commentRouter from './routes/commentRoute.js';
import postRouter from './routes/postRoute.js';
import userRouter from './routes/userRoute.js';
import { env, variables } from './utils/env.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socketServer);
export { io };

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', auth, userRouter);
app.use('/api/posts', auth, postRouter);
app.use('/api/comments', auth, commentRouter);
app.use('/api/chat', auth, chatRouter);
app.use('/api/admin', admin, adminRouter);

// Database
const URI = env(variables.mongoUri);
connectToDatabase(URI);

// Server listening
const PORT = env(variables.port) || 4000;
server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
