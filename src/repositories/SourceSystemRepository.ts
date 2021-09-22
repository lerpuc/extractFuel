import { SourceSystemInterface } from '../interfaces/SourceSystemInterface'
import SourceSystem from '../schema/SourceSystem'

class SourceSystemRepository {

    getAll = async(filters?: any) => {
        return (await SourceSystem.find(filters)) as SourceSystemInterface[]
    }

    getOne = async(filters: any) => {
        return (await SourceSystem.findOne(filters)) as SourceSystemInterface
    }

    createOne = async(body: any) => {
        return (await SourceSystem.create(body)) as SourceSystemInterface
    }

    updateOne = async(filters: any, sourceSystem: SourceSystemInterface) => {
        return (await SourceSystem.findOneAndUpdate( filters, { ...sourceSystem }, { upsert: true, new: true })) as SourceSystemInterface
    }

    deleteOne = async(filters: any) => {
        return (await SourceSystem.deleteOne( filters ))
    }
}

export default new SourceSystemRepository()