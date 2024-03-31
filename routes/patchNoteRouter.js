import express from 'express';
import { fetchPatchNote, getPatchNote } from '../controller/patchNoteController.js';

const router = express.Router();


router.get('/patchNote/fetch', fetchPatchNote);

router.get('/patchNote', getPatchNote);

export default router;