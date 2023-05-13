import express from 'express';

import { registerUser, loginUser, setProfilePic, getUsers, getCurrentUser, getUserByID, logOutUser } from '../controllers/usersController.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/currentUser', getCurrentUser);
router.get('/:userID', getUserByID);
router.get('/logout', logOutUser);

router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/setprofilepic/:userID', setProfilePic);

export default router;