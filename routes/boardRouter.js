import express from 'express';
import { getAllArticleList, boardWriteAndSummonerCheckInfo } from '../controller/boardController.js';

const router = express.Router();

router.get('/board', getAllArticleList);
router.post('/board/write', boardWriteAndSummonerCheckInfo);

export default router;