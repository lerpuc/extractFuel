import { Schema, model } from 'mongoose'
import { SourceSystemInterface } from '../interfaces/SourceSystemInterface'

const SourceSystemSchema = new Schema({
  documentNumber: String,
  name: String,
  socialName: String,
  sourceKey: String,
  baseUrl: String,
  authId: String,
  configr: Object,
}, {
  timestamps: true
})

export default model<SourceSystemInterface>('SourceSystem', SourceSystemSchema)
