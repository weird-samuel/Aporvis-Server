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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../Model/database");
const AdminController = {
    getAllUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.user.role === 'admin') {
            database_1.User.find({})
                .then(users => {
                return res.status(200).json({ users, success: true });
            })
                .catch(err => {
                return res
                    .status(500)
                    .json({ err, success: false, message: 'An error occured' });
            });
        }
        else {
            return res
                .status(401)
                .json({ message: 'User is not an Admin', success: false });
        }
        return;
    }),
    deleteUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.user.role === 'admin') {
            const { id } = req.query;
            database_1.User.findByIdAndDelete(id)
                .then(response => {
                if (response) {
                    return res
                        .status(200)
                        .json({ message: 'Deleted User', success: true });
                }
                else {
                    return res
                        .status(400)
                        .json({ message: 'User not found', success: false });
                }
            })
                .catch(err => {
                return res
                    .status(500)
                    .json({ err, success: false, message: 'An error occured' });
            });
        }
        else {
            return res
                .status(401)
                .json({ message: 'User is not an Admin', success: false });
        }
        return;
    }),
    getAdminUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.user.role === 'admin') {
            database_1.User.find({ role: 'admin' })
                .then(users => {
                return res.status(200).json({ users, success: true });
            })
                .catch(err => {
                return res
                    .status(500)
                    .json({ err, success: false, message: 'An error occured' });
            });
        }
        else {
            return res
                .status(401)
                .json({ message: 'User is not an Admin', success: false });
        }
        return;
    }),
    changeRole: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.user.role === 'admin') {
            const { id } = req.query;
            const { role } = req.body;
            database_1.User.findById(id)
                .then(user => {
                if (user) {
                    user.role = role;
                    user.save();
                    return res
                        .status(200)
                        .json({ message: 'Changed Successfully', success: true });
                }
                else {
                    return res
                        .status(404)
                        .json({ message: 'User Not Found', success: false });
                }
            })
                .catch(err => {
                return res
                    .status(500)
                    .json({ err, success: false, message: 'An error occured' });
            });
        }
        else {
            return res
                .status(401)
                .json({ message: 'User is not an Admin', success: false });
        }
        return;
    }),
    getPendingApplications: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.user.role === 'admin') {
            try {
                const pendingApplications = yield database_1.Application.find({
                    status: 'pending',
                }, {
                    referenceNumber: 1,
                    appointmentDate: 1,
                    processingCountry: 1,
                    visaType: 1,
                });
                return res.status(200).json({
                    success: true,
                    pendingApplications: pendingApplications,
                });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ message: 'An error occured', success: false });
            }
        }
        else {
            return res
                .status(401)
                .json({ message: 'User is not an Admin', success: false });
        }
    }),
    approveApplication: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.user.role === 'admin') {
            const { referenceNumber, action } = req.query;
            database_1.Application.findOne({ referenceNumber: referenceNumber })
                .then(application => {
                if (application) {
                    application.status = action;
                    application
                        .save()
                        .then(() => {
                        return res
                            .status(200)
                            .json({ message: 'Changed Successfully', success: true });
                    })
                        .catch(error => {
                        return res.status(400).json({
                            message: error.message,
                            success: false,
                        });
                    });
                    return;
                }
                else {
                    return res
                        .status(404)
                        .json({ message: 'Application not found', success: false });
                }
            })
                .catch(err => {
                return res
                    .status(500)
                    .json({ err, success: false, message: 'An error occured' });
            });
        }
        else {
            return res
                .status(401)
                .json({ message: 'User is not an Admin', success: false });
        }
        return;
    }),
    adminDashboard: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.user.role === 'admin') {
            try {
                const allUsers = yield database_1.User.find({}, {
                    firstName: 1,
                    lastName: 1,
                    title: 1,
                    nationality: 1,
                    email: 1,
                    image: 1,
                    phoneNumber: 1,
                });
                try {
                    const allAdmins = yield database_1.User.find({ role: 'admin' }, {
                        firstName: 1,
                        lastName: 1,
                        title: 1,
                        nationality: 1,
                        email: 1,
                        image: 1,
                        phoneNumber: 1,
                    });
                    try {
                        const allAppointments = yield database_1.Application.find({
                            appointmentDate: { $ne: null },
                        }).populate({
                            path: 'applicant',
                            select: 'firstName lastName title nationality email image phoneNumber',
                        });
                        try {
                            const allApplications = yield database_1.Application.find({}, {
                                referenceNumber: 1,
                                appointmentDate: 1,
                                processingCountry: 1,
                                visaType: 1,
                            });
                            return res.status(200).json({
                                allAdmins,
                                allApplications,
                                allAppointments,
                                allUsers,
                                success: true,
                            });
                        }
                        catch (error) {
                            return res.status(500).json({
                                message: 'An error occured getting visa applications',
                                success: false,
                            });
                        }
                    }
                    catch (error) {
                        return res.status(500).json({
                            error: error,
                            message: 'An error occured getting apppointments',
                            success: false,
                        });
                    }
                }
                catch (error) {
                    return res.status(500).json({
                        error: error,
                        message: 'An error occured getting admins',
                        success: false,
                    });
                }
            }
            catch (error) {
                return res.status(500).json({
                    error: error,
                    message: 'An error occured getting users',
                    success: false,
                });
            }
        }
        else {
            return res
                .status(401)
                .json({ message: 'User is not an Admin', success: false });
        }
        return;
    }),
    getSingleUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.user.role === 'admin') {
            const { id } = req.query;
            database_1.User.findById(id)
                .then(response => {
                if (response) {
                    return res.status(200).json({ user: response, success: true });
                }
                else {
                    return res
                        .status(400)
                        .json({ message: 'User not found', success: false });
                }
            })
                .catch(err => {
                return res
                    .status(500)
                    .json({ err, success: false, message: 'An error occured' });
            });
        }
        else {
            return res
                .status(401)
                .json({ message: 'User is not an Admin', success: false });
        }
        return;
    }),
};
exports.default = AdminController;
