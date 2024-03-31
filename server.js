import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import summonerRouter from './routes/summonerRouter.js'
import userRouter from './routes/userRouter.js'
import boardRouter from './routes/boardRouter.js'
import patchNoteRouter from './routes/patchNoteRouter.js'
import commentRouter from './routes/commentRouter.js'
const app = express();
dotenv.config();

const corOption = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors(corOption))

mongoose.connect(process.env.MONGO_DB_KEY)
.then(() => console.log('MongoDB Connected'))
.catch(e => console.error(e))

app.use(summonerRouter);
app.use(boardRouter);
app.use(userRouter);
app.use(patchNoteRouter);
app.use(commentRouter)
  
// app.get('/lckRank', async (req, res) => {
//     try {
//       const getRanking = await fetchingRanking();
//       res.json(getRanking);
//     }
//     catch (error) {
//       console.error('/lckRank get Error:', error);
//       return res.status(500).json({ error: '/lckRank route get Error' });
//     }
// })

app.listen(process.env.PORT, () => {
    console.log(`server port ${process.env.PORT} start`);
})
