import { AuthInterface } from '../interfaces/AuthInterface'
import Auth from '../schema/Auth'

class AuthRepository {

    getAll = async(filters?: any) => {
        return (await Auth.find(filters)) as AuthInterface[]
    }

    getOne = async(filters: any) => {
        return (await Auth.findOne(filters)) as AuthInterface
    }

    getAuthWithHiddenAttributes = async(filters: any) => {
        return (await Auth.findOne(filters).select(["+secretKey", "+secretIv"]))
    }

    createOne = async(body: any) => {
        return (await Auth.create(body)) as AuthInterface
    }

    updateOne = async(filters: any, auth: AuthInterface) => {
        return (await Auth.findByIdAndUpdate( filters, { ...auth }, { upsert: false, new: true })) as AuthInterface
    }

    deleteOne = async(filters: any) => {
        return (await Auth.deleteOne( filters ))
    }
}

export default new AuthRepository()