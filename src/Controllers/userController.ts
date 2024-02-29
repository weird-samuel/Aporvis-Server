import { Application, User } from '../Model/database'
import { Request, Response } from 'express'

const UserController = {
  getDashboard: async (req: Request, res: Response) => {
    const { id } = req.query
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
        approves: completeApplications,
      })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'An error occured', success: false })
    }
  },
  addBiodata: async (req: Request, res: Response) => {
    const { id } = req.query
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
    const { id } = req.query
    const {
      visaType,
      visaClass,
      processingCountry,
      numberOfEntries,
      mission,
      referenceNumber,
      appointmentDate,
    } = req.body
    Application.create({
      applicant: id,
      visaType,
      visaClass,
      processingCountry,
      numberOfEntries,
      mission,
      referenceNumber,
      appointmentDate,
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
}

export default UserController
