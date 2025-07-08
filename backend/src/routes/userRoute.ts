import express, { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  createUser,
  loginUser,
  logoutUser,
  fetchUser,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  deleteUserById,
} from '../controllers/userController.js';
import adminOnly from '../middleware/admin.js';

const router: Router = express.Router();

router.post('/user', createUser);
router.post('/user/login', loginUser);
router.post('/user/logout', auth, logoutUser);
router.get('/user/me', auth, fetchUser);
router.patch('/user/me', auth, updateUserProfile);
router.delete('/user/me', auth, deleteUser);
router.get('/users', auth, adminOnly, getAllUsers);
router.delete('/users/:id', auth, adminOnly, deleteUserById);

export default router;
