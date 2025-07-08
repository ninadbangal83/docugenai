import express, { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  createUser,
  loginUser,
  logoutUser,
  fetchUser,
  updateUserProfile,
  deleteUser,
} from '../controllers/userController.js';

const router: Router = express.Router();

router.post('/user', createUser);
router.post('/user/login', loginUser);
router.post('/user/logout', auth, logoutUser);
router.get('/user/me', auth, fetchUser);
router.patch('/user/me', auth, updateUserProfile);
router.delete('/user/me', auth, deleteUser);

export default router;
