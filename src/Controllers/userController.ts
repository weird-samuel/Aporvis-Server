import { Application, User, UserType } from '../Model/database'
import { Request, Response } from 'express'
import nodemailer from 'nodemailer'
import 'dotenv/config'
import { formatNormalDate } from '../Helpers/helperFunctions'

const UserController = {
  getDashboard: async (req: Request, res: Response) => {
    const { id } = req.user as UserType
    try {
      const completeApplications = await Application.find(
        {
          applicant: id,
          status: 'approved',
        },
        {
          referenceNumber: 1,
          appointmentDate: 1,
          processingCountry: 1,
          visaType: 1,
        }
      )
      const pendingApplications = await Application.find(
        {
          applicant: id,
          status: 'pending',
        },
        {
          referenceNumber: 1,
          appointmentDate: 1,
          processingCountry: 1,
          visaType: 1,
        }
      )
      const rejectedApplications = await Application.find(
        {
          applicant: id,
          status: 'rejected',
        },
        {
          referenceNumber: 1,
          appointmentDate: 1,
          processingCountry: 1,
          visaType: 1,
        }
      )
      return res.status(200).json({
        success: true,
        pending: pendingApplications,
        rejected: rejectedApplications,
        approved: completeApplications,
      })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'An error occured', success: false })
    }
  },
  addBiodata: async (req: Request, res: Response) => {
    const { id } = req.user as UserType
    const {
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
    } = req.body
    User.findByIdAndUpdate(id, {
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
            .json({ message: 'Successfuly Updated', success: true })
        } else {
          return res
            .status(404)
            .json({ message: 'User not found', success: false })
        }
      })
      .catch(error => {
        return res.status(500).json({ message: error, success: false })
      })
  },
  newApplication: async (req: Request, res: Response) => {
    const { id } = req.user as UserType
    const {
      visaType,
      visaClass,
      processingCountry,
      numberOfEntries,
      mission,
      referenceNumber,
    } = req.body
    Application.create({
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
            .json({ message: 'Successfuly Updated User', success: true })
        } else {
          return res
            .status(400)
            .json({ message: 'Bad Request', success: false })
        }
      })
      .catch(error => {
        return res.status(500).json({ message: error, success: false })
      })
  },
  sendEmail: async (req: Request, res: Response) => {
    const { referenceNumber, appointmentDate } = req.body
    const application = await Application.findOne({
      referenceNumber: referenceNumber,
    }).populate({ path: 'applicant', select: 'email' })
    if (!application) {
      return res
        .status(404)
        .json({ message: 'application not found', success: false })
    }
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Configure your email provider settings here
      service: 'Gmail',
      auth: {
        user: 'aaporvis@gmail.com',
        pass: process.env.AUTH_PASS,
      },
    })

    // Configure the email options
    const mailOptions = {
      from: 'aaporvis@gmail.com',
      to: (application.applicant as unknown as UserType).email,
      subject: 'Visa Appointment Schedule',
      text: `Hello, your visa appointment to Nigeria being processed via ${
        application.processingCountry
      } has been scheduled for ${formatNormalDate(
        appointmentDate
      )} Do well to keep to date`,
    }

    // Send the email
    transporter.sendMail(mailOptions, error => {
      if (error) {
        return res.status(400).json({ message: 'Failed to send the email.' })
      }
      return
    })
    application.appointmentDate = appointmentDate
    application.save().catch(error => {
      res.status(400).json({ message: 'An error occured', error })
    })
    return res.status(200).json({ message: 'Email sent successfully.' })
  },
  deleteApplication: async (req: Request, res: Response) => {
    const { referenceNumber } = req.query
    Application.findOneAndDelete({ referenceNumber: referenceNumber })
      .then(response => {
        if (response) {
          return res
            .status(200)
            .json({ message: 'Successfuly Deleted', success: true })
        } else {
          return res
            .status(400)
            .json({ message: 'Bad Request', success: false })
        }
      })
      .catch(error => {
        return res.status(500).json({ message: error, success: false })
      })
  },
  sendDuyilesEmail: async (req: Request, res: Response) => {
    const { message, email } = req.body
    // Create a Nodemailer transporter
    try {
      const transporter = nodemailer.createTransport({
        // Configure your email provider settings here
        service: 'Gmail',
        auth: {
          user: 'aaporvis@gmail.com',
          pass: process.env.AUTH_PASS,
        },
      })

      // Configure the email options
      const mailOptions = {
        from: 'aaporvis@gmail.com',
        to: email,
        subject: 'Grant Application',
        text: message,
      }

      // Send the email
      transporter.sendMail(mailOptions, error => {
        if (error) {
          return res.status(400).json({ message: 'Failed to send the email.' })
        }
        return
      })
      return res.status(200).json({ message: 'Email sent successfully.' })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'an error occurred', error: error })
    }
  },
}

export default UserController
