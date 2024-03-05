import { Request, Response } from 'express'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, UserType } from '../Model/database'

const authController = {
  isLoggedIn: async (req: Request, res: Response) => {
    if (req.user) {
      const user = req.user as UserType
      user.password = ''
      return res.status(200).json({
        auth: true,
        user,
      })
    } else {
      return res.status(401).json({ auth: false })
    }
  },
  registerUser: async (req: Request, res: Response) => {
    const { email, password } = req.body
    const hashedPassword = await hash(password, 10)

    try {
      const existingUser = await User.findOne({ email: email })
      if (!existingUser) {
        User.create({
          email: email,
          password: hashedPassword,
        })
          .then(result => {
            return res.status(200).json({ auth: true, user: result })
          })
          .catch(err => {
            return res.status(400).json({ auth: false, message: err.message })
          })
        return
      } else {
        return res
          .status(409)
          .json({ auth: false, message: 'User already exists' })
      }
    } catch (error) {
      return res
        .status(500)
        .json({ auth: false, user: null, message: 'An error occured' })
    }
  },
  loginUser: async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const user = await User.findOne(
        {
          email: (email as string).toLowerCase(),
        },
        { email: 1, password: 1, role: 1, firstName: 1, lastName: 1 }
      )
      if (!user) {
        return res
          .status(404)
          .json({ auth: false, message: 'User not found', user: null })
      }
      const match = await compare(password, user.password)
      if (!match) {
        return res
          .status(401)
          .json({ auth: false, message: 'Incorrrect Password', user: null })
      }
      const accessToken = jwt.sign(
        {
          id: user.id,
          user: user,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: '3h' }
      )
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
      })
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: 'Error authenticating user' })
    }
  },
  changeUserPassword: async (req: Request, res: Response) => {
    const { email, newPassword, oldPassword } = req.body
    const hashedPassword = await hash(newPassword, 10)

    try {
      const existingUser = await User.findOne(
        {
          email: email,
        },
        { email: 1, password: 1 }
      )
      if (existingUser) {
        const match = await compare(oldPassword, existingUser!.password)
        if (!match) {
          return res
            .status(401)
            .json({ auth: false, message: 'Incorrrect Password', user: null })
        }
        existingUser.password = hashedPassword
        existingUser.save()
        return res.status(200).json({ success: true })
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'user not found' })
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'An error occured' })
    }
  },
  logoutUser: async (req: Request, res: Response) => {
    req.logout(err => {
      if (err) {
        return res
          .status(500)
          .json({ error: err, success: false, message: 'An error occured' })
      }
      return res.status(200).json({ success: true })
    })
  },
}

export default authController
