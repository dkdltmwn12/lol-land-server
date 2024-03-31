import express from 'express';
import {authentic} from '../middleware/auth.js';
import { getComment, createComment, modifyComment, createReplyComment, deleteReplyComment, deleteComment } from '../controller/commentController.js';
const router = express.Router();

router.get('/comment', getComment);
router.post('/comment/create', createComment);
router.post('/comment/reply/create', createReplyComment);
router.put('/comment/modify', modifyComment);
router.post('/comment/delete', authentic, deleteComment)
router.post('/comment/reply/delete', authentic, deleteReplyComment);

export default router;