import express from 'express';

import { addChat, getChats } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', addChat);
router.post('/getChats', getChats);

export default router;