import { Document } from 'mongoose'

export interface SourceSystemInterface extends Document {
    sourceKey: string,
    documentNumber: string,
    name: string,
    socialName: string,
    baseUrl: string,
    authId: string,
    configr: ConfigrSourceInterface,
}

export interface ConfigrSourceInterface {
    fieldCpfCnpjSearch: string,
    fieldUsernameId: string,
    fieldPasswordId: string,
    buttonAccessId: string,
    elementCaptchaId: string,
    siteKeyToCaptcha: string,
    loggedSystemUrl: string,
    loginSystemUrl: string,
    useCaptcha: boolean,
    baseNameToFile: string,
    extensionToFile: string,
    metadata: Object
}
