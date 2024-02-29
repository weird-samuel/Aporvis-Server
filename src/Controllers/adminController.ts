import { Application, User } from 'Model/database'
import { Request, Response } from 'express'

const AdminController = {
  getAllUsers: async (req: Request, res: Response) => {
    User.find({})
      .then(users => {
        return res.status(200).json({ users, success: true })
      })
      .catch(err => {
        return res
          .status(500)
          .json({ err, success: false, message: 'An error occured' })
      })
  },
  deleteUser: async (req: Request, res: Response) => {
    const { id } = req.query
    User.findByIdAndDelete(id)
      .then(response => {
        if (response) {
          return res
            .status(200)
            .json({ message: 'Deleted User', success: true })
        } else {
          return res
            .status(400)
            .json({ message: 'User not found', success: false })
        }
      })
      .catch(err => {
        return res
          .status(500)
          .json({ err, success: false, message: 'An error occured' })
      })
  },
  getAdminUsers: async (req: Request, res: Response) => {
    User.find({ role: 'admin' })
      .then(users => {
        return res.status(200).json({ users, success: true })
      })
      .catch(err => {
        return res
          .status(500)
          .json({ err, success: false, message: 'An error occured' })
      })
  },
  changeRole: async (req: Request, res: Response) => {
    const { id } = req.query
    const { role } = req.body
    User.findById(id)
      .then(user => {
        if (user) {
          user.role = role
          user.save()
          return res
            .status(200)
            .json({ message: 'Changed Successfully', success: true })
        } else {
          return res
            .status(404)
            .json({ message: 'User Not Found', success: false })
        }
      })
      .catch(err => {
        return res
          .status(500)
          .json({ err, success: false, message: 'An error occured' })
      })
  },
  getPendingApplications: async (req: Request, res: Response) => {
    try {
      const pendingApplications = await Application.find(
        {
          status: 'pending',
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
        pendingApplications: pendingApplications,
      })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'An error occured', success: false })
    }
  },
  approveApplication: async (req: Request, res: Response) => {
    const { referenceNumber, action } = req.query
    Application.findOne({ referenceNumber: referenceNumber })
      .then(application => {
        if (application) {
          application.status = action as 'rejected' | 'approved'
          application.save()
          return res
            .status(200)
            .json({ message: 'Changed Successfully', success: true })
        } else {
          return res
            .status(404)
            .json({ message: 'Application not found', success: false })
        }
      })
      .catch(err => {
        return res
          .status(500)
          .json({ err, success: false, message: 'An error occured' })
      })
  },
  adminDashboard: async (req: Request, res: Response) => {
    try {
      const allUsers = await User.find(
        {},
        {
          firstName: 1,
          lastName: 1,
          title: 1,
          nationality: 1,
          email: 1,
          image: 1,
          phoneNumber: 1,
        }
      )
      try {
        const allAdmins = await User.find(
          { role: 'admin' },
          {
            firstName: 1,
            lastName: 1,
            title: 1,
            nationality: 1,
            email: 1,
            image: 1,
            phoneNumber: 1,
          }
        )

        try {
          const allAppointments = await Application.find({
            appointmentDate: { $ne: null },
          }).populate({
            path: 'applicant',
            select:
              'firstName lastName title nationality email image phoneNumber',
          })
          try {
            const allApplications = await Application.find(
              {},
              {
                referenceNumber: 1,
                appointmentDate: 1,
                processingCountry: 1,
                visaType: 1,
              }
            )
            return res.status(200).json({
              allAdmins,
              allApplications,
              allAppointments,
              allUsers,
              success: true,
            })
          } catch (error) {
            return res.status(500).json({
              message: 'An error occured getting visa applications',
              success: false,
            })
          }
        } catch (error) {
          return res.status(500).json({
            error: error,
            message: 'An error occured getting apppointments',
            success: false,
          })
        }
      } catch (error) {
        return res.status(500).json({
          error: error,
          message: 'An error occured getting admins',
          success: false,
        })
      }
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured users',
        success: false,
      })
    }
  },
  getSingleUser: async (req: Request, res: Response) => {
    const { id } = req.query
    User.findById(id)
      .then(response => {
        if (response) {
          return res.status(200).json({ user: response, success: true })
        } else {
          return res
            .status(400)
            .json({ message: 'User not found', success: false })
        }
      })
      .catch(err => {
        return res
          .status(500)
          .json({ err, success: false, message: 'An error occured' })
      })
  },
}

export default AdminController
