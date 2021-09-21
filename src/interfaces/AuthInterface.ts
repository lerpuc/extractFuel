import { Document } from 'mongoose'
import { AuthTypeEnum } from '../enums/AuthTypeEnum';

export interface AuthInterface extends Document {
    name: string,
    authType: AuthTypeEnum,
    clientId: string,
    changePasswordOnNextLogin: boolean,
}

export interface TokenInterface extends Document {
    token: string,
    tokenValidAt: Date  
}

export interface SecretKeyInterface extends Document {
    clientId: string,
    secretKey: string,
    secretIv: string,
}