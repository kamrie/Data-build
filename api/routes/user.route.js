import express from 'express';
import { test } from '../controllers/user.controllers.js'
import { getWallet } from '../controllers/user.controllers.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router();

router.get('/test', verifyToken, test);

router.get("/wallet", verifyToken, getWallet);


export default router;