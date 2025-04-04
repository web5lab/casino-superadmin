import express from 'express';
import { createUser, getCasinoSettings, getUsers, updateCasinoSettings, userAllTransactions } from '../controller/clientPanel.controller.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

router.post('/all-trasactions',authenticateToken,userAllTransactions);
router.post('/withdraw-fund');
router.get('/get-casino-setting/:casinoId', authenticateToken,getCasinoSettings);
router.get('/get-casino-sub-admins', authenticateToken,getUsers);
router.post('/create-casino-sub-admins', authenticateToken,createUser);
router.post('/update-casino-setting/:casinoId',authenticateToken,updateCasinoSettings);

export default router;