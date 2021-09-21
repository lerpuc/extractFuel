import { PersonInterface } from '../interfaces/PersonInterface'
import Person from '../schema/Person'

class PersonRepository {

    getAll = async(filters?: any) => {
        return (await Person.find(filters)) as PersonInterface[]
    }

    getOne = async(filters: any) => {
        return (await Person.findOne(filters)) as PersonInterface
    }

    createOne = async(body: any) => {
        return (await Person.create(body)) as PersonInterface
    }

    updateOne = async(filters: any, person: PersonInterface) => {
        return (await Person.findOneAndUpdate( filters, { ...person }, { upsert: true, new: true })) as PersonInterface
    }

    deleteOne = async(filters: any) => {
        return (await Person.deleteOne( filters ))
    }
}

export default new PersonRepository()