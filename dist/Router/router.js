"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const authMiddleware_1 = __importDefault(require("../Middlewares/authMiddleware"));
const authController_1 = __importDefault(require("../Controllers/authController"));
const userController_1 = __importDefault(require("../Controllers/userController"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Good' });
});
router.get('/user/checkauth', authMiddleware_1.default.authenticate('jwt', { session: false }), authController_1.default.isLoggedIn);
router.post('/user/login', authController_1.default.loginUser);
router.post('/user/register', authController_1.default.registerUser);
router.post('/user/changepassword', authMiddleware_1.default.authenticate('jwt', { session: false }), authController_1.default.changeUserPassword);
router.get('/user/logout', authController_1.default.logoutUser);
router.patch('/user/updateprofile', authMiddleware_1.default.authenticate('jwt', { session: false }), userController_1.default.addBiodata);
router.get('/user/dashboard', authMiddleware_1.default.authenticate('jwt', { session: false }), userController_1.default.getDashboard);
router.post('/user/application', authMiddleware_1.default.authenticate('jwt', { session: false }), userController_1.default.newApplication);
router.delete('/user/application', authMiddleware_1.default.authenticate('jwt', { session: false }), userController_1.default.deleteApplication);
router.post('/user/sendappointment', authMiddleware_1.default.authenticate('jwt', { session: false }), userController_1.default.sendEmail);
exports.default = router;
