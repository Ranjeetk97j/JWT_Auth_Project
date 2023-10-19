import express from 'express';
import { changePassword, loggedUser, login, register, sendUserPasswordResetEmail, userPasswordReset } from '../controller/userController.js';
import { checkUserAuth } from '../middleware/auth.js';
const router = express.Router();

//Public Routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/send-reset-password-email').post(sendUserPasswordResetEmail);
router.route('/reset-password/:id/:token').post(userPasswordReset);

//Protected Routes
router.route('/changepassword').post(checkUserAuth, changePassword)
router.route('/logeduser').get(checkUserAuth, loggedUser)

export default router;

