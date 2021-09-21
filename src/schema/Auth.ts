import { Schema, model } from 'mongoose'
import { AuthInterface } from '../interfaces/AuthInterface'

const AuthSchema = new Schema({
  name: String,
  authType: String,
  clientId: {
    type: String,
    required: true,
    unique: true,
  },
  secretKey: {
    type: String,
    required: true,
    select: false,
  },
  secretIv: {
    type: String,
    select: false,
  },
  changePasswordOnNextLogin: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    select: false,
  },
  tokenValidAt: Date,
}, {
  timestamps: true
})

export default model<AuthInterface>('Auth', AuthSchema)