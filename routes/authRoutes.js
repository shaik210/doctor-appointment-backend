import express from 'express';
import { CreateUser, loginUser } from '../controllers/authController.js';


const router = express.Router();


router.post('/register', CreateUser);
router.post('/login', loginUser);

export default router;
