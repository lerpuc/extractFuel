import { Schema, model } from 'mongoose'
import { PersonInterface } from '../interfaces/PersonInterface'

const PersonSchema = new Schema({
  name: String,
  socialName: String,
  documentNumber: String,
  personType: String,
}, {
  timestamps: true
})

export default model<PersonInterface>('Person', PersonSchema)
