import express from 'express';
import { test, getWallet, fundWallet } from '../controllers/user.controllers.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router();

router.get('/test', verifyToken, test);

router.get("/wallet", verifyToken, getWallet);

router.post("/wallet/fund", verifyToken, fundWallet);

export default router;