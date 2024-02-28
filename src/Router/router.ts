import express from 'express'
import 'dotenv/config'
import passport from '../Middlewares/authMiddleware'
import authController from '../Controllers/authController'
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Good' })
})

// router.get(
//   '/healthworker',
//   passport.authenticate('jwt', { session: false }),
//   authController.isLoggedIn
// )
router.post('/user/login', authController.loginUser)
router.post('/user/register', authController.registerUser)
router.post(
  '/user/changepassword',
  passport.authenticate('jwt', { session: false }),
  authController.changeUserPassword
)
router.get('/user/logout', authController.logoutUser)

export default router
