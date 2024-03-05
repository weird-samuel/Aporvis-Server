"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../Model/database");
const authController = {
    isLoggedIn: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.user) {
            const user = req.user;
            user.password = '';
            return res.status(200).json({
                auth: true,
                user,
            });
        }
        else {
            return res.status(401).json({ auth: false });
        }
    }),
    registerUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        try {
            const existingUser = yield database_1.User.findOne({ email: email });
            if (!existingUser) {
                database_1.User.create({
                    email: email,
                    password: hashedPassword,
                })
                    .then(result => {
                    return res.status(200).json({ auth: true, user: result });
                })
                    .catch(err => {
                    return res.status(400).json({ auth: false, message: err.message });
                });
                return;
            }
            else {
                return res
                    .status(409)
                    .json({ auth: false, message: 'User already exists' });
            }
        }
        catch (error) {
            return res
                .status(500)
                .json({ auth: false, user: null, message: 'An error occured' });
        }
    }),
    loginUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield database_1.User.findOne({
                email: email.toLowerCase(),
            }, { email: 1, password: 1, role: 1, firstName: 1, lastName: 1 });
            if (!user) {
                return res
                    .status(404)
                    .json({ auth: false, message: 'User not found', user: null });
            }
            const match = yield (0, bcrypt_1.compare)(password, user.password);
            if (!match) {
                return res
                    .status(401)
                    .json({ auth: false, message: 'Incorrrect Password', user: null });
            }
            const accessToken = jsonwebtoken_1.default.sign({
                id: user.id,
                user: user,
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
            return res.status(200).json({
                auth: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                accessToken,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ error: error, message: 'Error authenticating user' });
        }
    }),
    changeUserPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, newPassword, oldPassword } = req.body;
        const hashedPassword = yield (0, bcrypt_1.hash)(newPassword, 10);
        try {
            const existingUser = yield database_1.User.findOne({
                email: email,
            }, { email: 1, password: 1 });
            if (existingUser) {
                const match = yield (0, bcrypt_1.compare)(oldPassword, existingUser.password);
                if (!match) {
                    return res
                        .status(401)
                        .json({ auth: false, message: 'Incorrrect Password', user: null });
                }
                existingUser.password = hashedPassword;
                existingUser.save();
                return res.status(200).json({ success: true });
            }
            else {
                return res
                    .status(404)
                    .json({ success: false, message: 'user not found' });
            }
        }
        catch (error) {
            return res
                .status(500)
                .json({ success: false, message: 'An error occured' });
        }
    }),
    logoutUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        req.logout(err => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: err, success: false, message: 'An error occured' });
            }
            return res.status(200).json({ success: true });
        });
    }),
};
exports.default = authController;
