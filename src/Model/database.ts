import mongoose, { Document } from 'mongoose'
import 'dotenv/config'
mongoose.set('strictQuery', true)
export const connectToDatabase = async () => {
  mongoose
    .connect(process.env.CONNECTION_STRING! as string, {
      dbName: 'Aporvis',
    })
    .then(() => {
      console.log('Database Connection Succeeded')
    })
    .catch(err => {
      console.log(`An error occurred connecting to database: ${err}`)
    })
}
mongoose.connection.on('error', err => {
  console.log(
    `An error occurred connecting to database: ${err},\n...reconnecting`
  )
  mongoose
    .connect(process.env.CONNECTION_STRING! as string, {
      dbName: 'Aporvis',
    })
    .then(() => {
      console.log('Database Connection Succeeded')
    })
    .catch(err => {
      console.log(`An error occurred connecting to database ${err}`)
    })
})

export interface UserType extends Document {
  email: string
  password: string
  name: string
  image: string | null
  nationality: string
  passportNumber: string
  passportType: string
  passportExpiry: Date
  title: string
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: Date
  placeOfBirth: string
  maritalStatus: string
  phoneNumber: string
  occupation: string
  address: string
  state: string
  postalCode: string
  zipCode: string
  role: 'applicant' | 'admin'
}

interface ApplicationType extends Document {
  applicant: mongoose.Types.ObjectId
  visaType: string
  visaClass: string
  processingCountry: string
  numberOfEntries: number
  mission: string
  referenceNumber: string
  status: 'pending' | 'approved' | 'rejected'
  appointmentDate?: Date
}

const userSchema = new mongoose.Schema<UserType>({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
    default: null,
  },
  nationality: {
    type: String,
  },
  passportNumber: {
    type: String,
  },
  passportType: {
    type: String,
  },
  passportExpiry: {
    type: Date,
  },
  title: {
    type: String,
  },
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  placeOfBirth: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  occupation: {
    type: String,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  role: {
    type: String,
    enum: ['applicant', 'admin'],
    default: 'applicant',
  },
})

const applicationSchema = new mongoose.Schema<ApplicationType>({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  visaType: {
    type: String,
    required: true,
  },
  visaClass: {
    type: String,
    required: true,
  },
  processingCountry: {
    type: String,
    required: true,
  },
  numberOfEntries: {
    type: Number,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  referenceNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  appointmentDate: {
    type: Date,
    default: null,
  },
})

export const User = mongoose.model<UserType>('User', userSchema)
export const Application = mongoose.model<ApplicationType>(
  'Application',
  applicationSchema
)
