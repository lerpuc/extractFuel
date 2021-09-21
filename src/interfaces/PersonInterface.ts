import { Document } from 'mongoose'
import { PersonTypeEnum } from '../enums/PersonTypeEnum';

export interface PersonInterface extends Document {
    name: string,
    socialName: string,
    documentNumber: string,
    personType: PersonTypeEnum
}