import { PersonTypeEnum } from '../enums/PersonTypeEnum'
import PersonRepository from '../repositories/PersonRepository'
import AppError from '../utils/AppErrorUtil'
import CommonsUtil from '../utils/CommonsUtil'
import LocaleBrUtil from '../utils/LocaleBrUtil'

class PersonService {
  
  index = async (filters?: any) => {
    const filterName = CommonsUtil.factoryRegexMongoose(filters?.name)
    const filterSocialName = CommonsUtil.factoryRegexMongoose(filters?.socialName)
    const filter = {
      ...filters,
      ...(filterName && {
        name: filterName
      }),
      ...(filterSocialName && {
        socialName: filterSocialName
      })
    }
    const persons = await PersonRepository.getAll(filter)
    return persons
  }

  create = async (request: any) => {
    const name = CommonsUtil.factoryReturnValueOrNull(request?.name)
    let documentNumber = CommonsUtil.factoryReturnValueOrNull(request?.documentNumber)
    if (documentNumber) documentNumber = LocaleBrUtil.formatCpfCnpj(documentNumber)
    if (!name || !documentNumber) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Para criar uma nova pessoa é obrigatório o envio dos atributos: 'name' e 'documentNumber'`))
    }
    if (!LocaleBrUtil.isValidCpfCnpj(documentNumber)) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `O Número do documento informado é inválido para: ${documentNumber.length > 11 ? 'CNPJ' : 'CPF'}. `))
    }
    request.documentNumber = documentNumber
    request.personType = documentNumber.length > 11 ? PersonTypeEnum.COMPANY : PersonTypeEnum.INDIVIDUAL
    const getExistingPerson = await PersonRepository.getOne({documentNumber})
    if (getExistingPerson) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Já existe uma pessoa na base com o mesmo valor do atributo: 'documentNumber': ${documentNumber} - enviado nesta requisição.`))
    }
    const person = await PersonRepository.createOne(request)
    return person
  }

  update = async (id: any, body: any) => {
    const filter = { _id: id }
    let documentNumber = CommonsUtil.factoryReturnValueOrNull(body?.documentNumber)
    documentNumber = documentNumber ? documentNumber.replace(/\D/g, '').toString() : null
    if (documentNumber) {
      const newFilter = {
        documentNumber,
        _id: { $ne: id }
      }
      const getExistingPerson = await PersonRepository.getOne(newFilter)
      if (getExistingPerson) {
        throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não será possível realizar esta atualualização, pois já existe uma outra pessoa na base com o valor do atributo 'documentNumber': ${documentNumber} enviado nesta requisição.`))
      }
      body.documentNumber = documentNumber
      body.personType = documentNumber.length > 11 ? PersonTypeEnum.COMPANY : PersonTypeEnum.INDIVIDUAL
    }
    const person = await PersonRepository.updateOne(filter, body)
    if (!person) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não foi possível realizar esta requisição, não foi localizado um registro para o identificador: ${id}`))
    }
    return person
  }

  delete = async (id: any) => {
    const filter = { _id: id }
    const getExistingAuth = await PersonRepository.getOne(filter)
    if (!getExistingAuth) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não foi possível realizar esta requisição, não foi localizado um registro para o identificador: ${id}`))
    }
    const person = await PersonRepository.deleteOne(filter)
    return CommonsUtil.factoryReturnObject(0, `Registro excluído com sucesso. Identificador: ${id}`)
  }

}

export default new PersonService()