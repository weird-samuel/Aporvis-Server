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
const database_1 = require("../Model/database");
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const helperFunctions_1 = require("../Helpers/helperFunctions");
const UserController = {
    getDashboard: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.user;
        try {
            const completeApplications = yield database_1.Application.find({
                applicant: id,
                status: 'approved',
            }, {
                referenceNumber: 1,
                appointmentDate: 1,
                processingCountry: 1,
                visaType: 1,
            });
            const pendingApplications = yield database_1.Application.find({
                applicant: id,
                status: 'pending',
            }, {
                referenceNumber: 1,
                appointmentDate: 1,
                processingCountry: 1,
                visaType: 1,
            });
            const rejectedApplications = yield database_1.Application.find({
                applicant: id,
                status: 'rejected',
            }, {
                referenceNumber: 1,
                appointmentDate: 1,
                processingCountry: 1,
                visaType: 1,
            });
            return res.status(200).json({
                success: true,
                pending: pendingApplications,
                rejected: rejectedApplications,
                approved: completeApplications,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: 'An error occured', success: false });
        }
    }),
    addBiodata: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.user;
        const { image, nationality, passportType, title, lastName, firstName, middleName, dateOfBirth, placeOfBirth, maritalStatus, phoneNumber, passportNumber, passportExpiryDate, occupation, address, state, postalCode, zipCode, } = req.body;
        database_1.User.findByIdAndUpdate(id, {
            $set: {
                image,
                nationality,
                passportType,
                title,
                lastName,
                firstName,
                middleName,
                dateOfBirth,
                placeOfBirth,
                maritalStatus,
                phoneNumber,
                passportNumber,
                passportExpiryDate,
                occupation,
                address,
                state,
                postalCode,
                zipCode,
            },
        })
            .then(response => {
            if (response) {
                return res
                    .status(200)
                    .json({ message: 'Successfuly Updated', success: true });
            }
            else {
                return res
                    .status(404)
                    .json({ message: 'User not found', success: false });
            }
        })
            .catch(error => {
            return res.status(500).json({ message: error, success: false });
        });
    }),
    newApplication: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.user;
        const { visaType, visaClass, processingCountry, numberOfEntries, mission, referenceNumber, } = req.body;
        database_1.Application.create({
            applicant: id,
            visaType,
            visaClass,
            processingCountry,
            numberOfEntries,
            mission,
            referenceNumber,
        })
            .then(response => {
            if (response) {
                return res
                    .status(200)
                    .json({ message: 'Successfuly Updated User', success: true });
            }
            else {
                return res
                    .status(400)
                    .json({ message: 'Bad Request', success: false });
            }
        })
            .catch(error => {
            return res.status(500).json({ message: error, success: false });
        });
    }),
    sendEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { referenceNumber, appointmentDate } = req.body;
        const application = yield database_1.Application.findOne({
            referenceNumber: referenceNumber,
        }).populate({ path: 'applicant', select: 'email' });
        if (!application) {
            return res
                .status(404)
                .json({ message: 'application not found', success: false });
        }
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: 'aaporvis@gmail.com',
                pass: process.env.AUTH_PASS,
            },
        });
        const mailOptions = {
            from: 'aaporvis@gmail.com',
            to: application.applicant.email,
            subject: 'Visa Appointment Schedule',
            text: `Hello, your visa appointment to Nigeria being processed via ${application.processingCountry} has been scheduled for ${(0, helperFunctions_1.formatNormalDate)(appointmentDate)} Do well to keep to date`,
        };
        transporter.sendMail(mailOptions, error => {
            if (error) {
                return res.status(400).json({ message: 'Failed to send the email.' });
            }
            return;
        });
        application.appointmentDate = appointmentDate;
        application.save().catch(error => {
            res.status(400).json({ message: 'An error occured', error });
        });
        return res.status(200).json({ message: 'Email sent successfully.' });
    }),
    deleteApplication: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { referenceNumber } = req.query;
        database_1.Application.findOneAndDelete({ referenceNumber: referenceNumber })
            .then(response => {
            if (response) {
                return res
                    .status(200)
                    .json({ message: 'Successfuly Deleted', success: true });
            }
            else {
                return res
                    .status(400)
                    .json({ message: 'Bad Request', success: false });
            }
        })
            .catch(error => {
            return res.status(500).json({ message: error, success: false });
        });
    }),
    sendDuyilesEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { message, email } = req.body;
        try {
            const transporter = nodemailer_1.default.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'aaporvis@gmail.com',
                    pass: process.env.AUTH_PASS,
                },
            });
            const mailOptions = {
                from: 'aaporvis@gmail.com',
                to: email,
                subject: 'Grant Application',
                text: message,
            };
            transporter.sendMail(mailOptions, error => {
                if (error) {
                    return res.status(400).json({ message: 'Failed to send the email.' });
                }
                return;
            });
            return res.status(200).json({ message: 'Email sent successfully.' });
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: 'an error occurred', error: error });
        }
    }),
};
exports.default = UserController;
