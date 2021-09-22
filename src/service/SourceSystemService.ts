import SourceRepository from '../repositories/SourceSystemRepository'
import AppError from '../utils/AppErrorUtil'
import CommonsUtil from '../utils/CommonsUtil'
import LocaleBrUtil from '../utils/LocaleBrUtil'

class SourceService {
  
  index = async (filters?: any) => {
    const filterName = CommonsUtil.factoryRegexMongoose(filters?.name)
    const filter = {
      ...filters,
      ...(filterName && {
        name: filterName
      })
    }
    const sources = await SourceRepository.getAll(filter)
    return sources
  }

  create = async (request: any) => {
    const name = CommonsUtil.factoryReturnValueOrNull(request?.name)
    const sourceKey = CommonsUtil.factoryReturnValueOrNull(request?.sourceKey)
    let documentNumber = CommonsUtil.factoryReturnValueOrNull(request?.documentNumber)
    if (documentNumber) documentNumber = LocaleBrUtil.formatCpfCnpj(documentNumber)
    if (!name || !documentNumber || !sourceKey) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Para criar um novo SOURCE é obrigatório o envio dos atributos: 'name', 'sourceKey' e 'documentNumber'`))
    }
    if (!LocaleBrUtil.isValidCpfCnpj(documentNumber)) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `O Número do documento informado é inválido para: ${documentNumber.length > 11 ? 'CNPJ' : 'CPF'}. `))
    }
    request.documentNumber = documentNumber
    const getExistingSource = await SourceRepository.getOne({documentNumber, sourceKey})
    if (getExistingSource) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Já existe um SOURCE na base com os mesmos valores dos atributos: 'documentNumber' e/ou 'sourceKey' - enviado nesta requisição.`))
    }
    const source = await SourceRepository.createOne(request)
    return source
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
      const getExistingSource = await SourceRepository.getOne(newFilter)
      if (getExistingSource) {
        throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não será possível realizar esta atualização, pois já existe um outro SOURCE na base com o valor do atributo 'documentNumber': ${documentNumber} enviado nesta requisição.`))
      }
      body.documentNumber = documentNumber
    }
    const source = await SourceRepository.updateOne(filter, body)
    if (!source) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não foi possível realizar esta requisição, não foi localizado um registro para o identificador: ${id}`))
    }
    return source
  }

  delete = async (id: any) => {
    const filter = { _id: id }
    const getExistingAuth = await SourceRepository.getOne(filter)
    if (!getExistingAuth) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não foi possível realizar esta requisição, não foi localizado um registro para o identificador: ${id}`))
    }
    await SourceRepository.deleteOne(filter)
    return CommonsUtil.factoryReturnObject(0, `Registro excluído com sucesso. Identificador: ${id}`)
  }

  getSourceValid = async (filters: any) => {
    const documentNumber = CommonsUtil.factoryReturnValueOrNull(filters?.documentNumber)
    const sourceKey = CommonsUtil.factoryReturnValueOrNull(filters?.sourceKey)
    const filter = {
      ...(documentNumber && { documentNumber }),
      ...(sourceKey && { sourceKey })
    }
    if (Object.keys(filter).length <= 0) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, "Obrigatório o envio de paramêtros para realizar esta consulta - os filtros permitidos são: 'documentNumber' e/ou 'sourceKey'. "))
    }
    const source = await SourceRepository.getOne(filter)
    if (!source) {
        throw new AppError(null, CommonsUtil.factoryReturnObject(9, "O sistema não encontrou registro de SOURCE para os paramêtros informados na requisição. "))
    }
    return source
  }

}

export default new SourceService()