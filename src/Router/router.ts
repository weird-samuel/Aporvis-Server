import express from 'express'
import 'dotenv/config'
import passport from '../Middlewares/authMiddleware'
import authController from '../Controllers/authController'
import UserController from '../Controllers/userController'
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Good' })
})

router.get(
  '/user/checkauth',
  passport.authenticate('jwt', { session: false }),
  authController.isLoggedIn
)
router.post('/user/login', authController.loginUser)
router.post('/user/register', authController.registerUser)
router.post(
  '/user/changepassword',
  passport.authenticate('jwt', { session: false }),
  authController.changeUserPassword
)
router.get('/user/logout', authController.logoutUser)
router.patch(
  '/user/updateprofile',
  passport.authenticate('jwt', { session: false }),
  UserController.addBiodata
)
router.get(
  '/user/dashboard',
  passport.authenticate('jwt', { session: false }),
  UserController.getDashboard
)
router.post(
  '/user/application',
  passport.authenticate('jwt', { session: false }),
  UserController.newApplication
)
router.delete(
  '/user/application',
  passport.authenticate('jwt', { session: false }),
  UserController.deleteApplication
)
router.post(
  '/user/sendappointment',
  passport.authenticate('jwt', { session: false }),
  UserController.sendEmail
)
export default router
