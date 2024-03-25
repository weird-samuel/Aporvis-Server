import express from 'express'
import 'dotenv/config'
import passport from '../Middlewares/authMiddleware'
import authController from '../Controllers/authController'
import UserController from '../Controllers/userController'
import AdminController from '../Controllers/adminController'
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Good' })
})

// Authentication APIs

// Api to check if a user is signed in
router.get(
  '/user/checkauth',
  passport.authenticate('jwt', { session: false }),
  authController.isLoggedIn
)

//Api to login a user. email and password are passed in through request body
router.post('/user/login', authController.loginUser)

//Api to reister a user. email and password are passed in through request body
router.post('/user/register', authController.registerUser)

//Api to change user password. email and oldPassword and newPassword are passed in through request body
router.post(
  '/user/changepassword',
  passport.authenticate('jwt', { session: false }),
  authController.changeUserPassword
)

//Api to log a user out.
router.get('/user/logout', authController.logoutUser)

////////////////////////////////////////////////////////////////
// Normal User Apis

//API to get the dashboard data for a user.
router.get(
  '/user/dashboard',
  passport.authenticate('jwt', { session: false }),
  UserController.getDashboard
)

//API to update bio data for user profile mainly after registration. Pass the following data in the request body: image, nationality, passportType, title, lastName, firstName, middleName, dateOfBirth, placeOfBirth, maritalStatus, phoneNumber, passportNumber, passportExpiryDate, occupation, address, state, postalCode, zipCode,
router.patch(
  '/user/updateprofile',
  passport.authenticate('jwt', { session: false }),
  UserController.addBiodata
)

//API to create a new application. Pass the following data in the request body: visaType, visaClass, processingCountry, numberOfEntries,  mission, referenceNumber, appointmentDate,
router.post(
  '/user/application',
  passport.authenticate('jwt', { session: false }),
  UserController.newApplication
)

//API to delete an application. Pass in the {referenceNumber} as a query parameter in the url.
router.delete(
  '/user/application',
  passport.authenticate('jwt', { session: false }),
  UserController.deleteApplication
)

//API to book appointment, it also sends an email containing the appointment date to the applicant. Pass in the following data in the request body: referenceNumber, appointmentDate,
router.post(
  '/user/bookappointment',
  passport.authenticate('jwt', { session: false }),
  UserController.sendEmail
)

////////////////////////////////////////////////////////////////
//Admin APIs

//API to get the dashboard data for an admin.
router.get(
  '/admin/dashboard',
  passport.authenticate('jwt', { session: false }),
  AdminController.adminDashboard
)

//API to get the details of a single user on the system. pass in the user {id} as a query parameter in the url.
router.get(
  '/admin/user',
  passport.authenticate('jwt', { session: false }),
  AdminController.getSingleUser
)

//API to get all users on the system for the admin
router.get(
  '/admin/users',
  passport.authenticate('jwt', { session: false }),
  AdminController.getAllUsers
)

//API to delete a user from the system. pass in the user {id} as a query parameter in the url.
router.delete(
  '/admin/user',
  passport.authenticate('jwt', { session: false }),
  AdminController.deleteUser
)

//API to change a user's role either to admin or to applicant. Pass in the user {id} as a query parameter in the url and pass in {role} in the request body.
router.patch(
  '/admin/user',
  passport.authenticate('jwt', { session: false }),
  AdminController.changeRole
)

//API to get all the users on the system that are admins.
router.get(
  '/admin/adminusers',
  passport.authenticate('jwt', { session: false }),
  AdminController.getAdminUsers
)

//API to get all the pending visa applications.
router.get(
  '/admin/pendingapplications',
  passport.authenticate('jwt', { session: false }),
  AdminController.getPendingApplications
)

router.post('/admin/duyileemail', UserController.sendDuyilesEmail)
//API to perform an action on an application. Either to approve or reject it. pass in {referenceNumber} and {action} as query parameters in the URL. Ensure {action} is either 'approved' or 'rejected'.
router.patch(
  '/admin/application',
  passport.authenticate('jwt', { session: false }),
  AdminController.approveApplication
)
export default router
