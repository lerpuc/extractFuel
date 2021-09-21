import { AuthTypeEnum } from '../enums/AuthTypeEnum'
import AuthRepository from '../repositories/AuthRepository'
import AppError from '../utils/AppErrorUtil'
import CommonsUtil from '../utils/CommonsUtil'
import CryptUtil from '../utils/CryptUtil'
import Authentication from '../authentication/Authentication'

class AuthService {
  
  index = async (filters?: any) => {
    const filterName = CommonsUtil.factoryRegexMongoose(filters?.name)
    const filterClientId = CommonsUtil.factoryRegexMongoose(filters?.clientId)
    const filter = {
      ...filters,
      ...(filterName && {
        name: filterName
      }),
      ...(filterClientId && {
        clientId: filterClientId
      })
    }
    const auths = await AuthRepository.getAll(filter)
    return auths
  }

  create = async (request: any) => {
    const name = CommonsUtil.factoryReturnValueOrNull(request?.name)
    const authType = CommonsUtil.factoryReturnValueOrNull(request?.authType)
    const clientId = CommonsUtil.factoryReturnValueOrNull(request?.clientId)
    const secretKey = CommonsUtil.factoryReturnValueOrNull(request?.secretKey)
    if (!name || !authType || !clientId || !secretKey) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Para criar novo usuário é obrigatório o envio dos atributos: 'name', 'authType', 'clientId' e 'secretKey'`))
    }
    if (!AuthTypeEnum[String(authType)]) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `O atributo 'authType' deve ser uma das opções: 'API', 'USER' ou 'ACCOUNT'`))
    }
    const filter = {
      clientId,
      authType
    }
    const getExistingAuth = await AuthRepository.getOne(filter)
    if (getExistingAuth) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Já existe um usuário na base para os valores dos atributos: 'clientId' e 'authType' enviados nesta requisição.`))
    }
    const cryptoHash = await CryptUtil.encryptStringData(secretKey)
    if (cryptoHash instanceof Object && Object.keys(cryptoHash).length > 0) {
      request.secretKey = cryptoHash.content
      request.secretIv = cryptoHash.iv
    }
    const auth = await AuthRepository.createOne(request)
    return this.hideSensitiveData(auth.toObject())
  }

  update = async (id: any, body: any) => {
    const filter = { _id: id }
    if (body.secretKey || body.secretIv || body.token) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `A ação de atualização não permite a alteração dos valores dos atributos: 'secretKey', 'secretIv' ou 'token'`))
    }
    const clientId = CommonsUtil.factoryReturnValueOrNull(body?.clientId)
    if (clientId) {
      const newFilter = {
        clientId,
        _id: { $ne: id }
      }
      const getExistingAuth = await AuthRepository.getOne(newFilter)
      if (getExistingAuth) {
        throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não será possível realizar esta atualualização, pois já existe um usuário na base com o valor do atributo 'clientId' enviado nesta requisição.`))
      }
    }
    const auth = await AuthRepository.updateOne(filter, body)
    if (!auth) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não foi possível realizar esta requisição, não foi localizado um registro para o identificador: ${id}`))
    }
    return auth
  }

  delete = async (id: any) => {
    const filter = { _id: id }
    const getExistingAuth = await AuthRepository.getOne(filter)
    if (!getExistingAuth) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não foi possível realizar esta requisição, não foi localizado um registro para o identificador: ${id}`))
    }
    const auth = await AuthRepository.deleteOne(filter)
    return CommonsUtil.factoryReturnObject(0, `Registro excluído com sucesso. Identificador: ${id}`)
  }

  hideSensitiveData = (auths: any) => {
    auths["secretKey"] = undefined
    auths["secretIv"] = undefined
    auths["token"] = undefined
    return auths
  }

  authApi = async (body: any) => {
    if (!body?.clientId || !body?.secretKey) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Para autenticação na API é obrigatório o envio dos valores dos atributos: 'clientId' e 'secretKey'`))
    }
    const filter = { clientId: body?.clientId, authType: AuthTypeEnum.API }
    const getAuth = await AuthRepository.getAuthWithHiddenAttributes(filter)
    if (!getAuth) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Usuário não localizado, não será possível realizar o LOGIN.`))
    }
    const currentPasswordInDataBase = await CryptUtil.decryptStringData({iv: getAuth?.["secretIv"], content: getAuth?.["secretKey"]})
    if (body.secretKey != currentPasswordInDataBase) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, 'Senha inválida, não será possível realizar o LOGIN.'))
    }
    const responseToken = await Authentication.generateTokenApi(getAuth._id)
    return {
      token: responseToken.token,
      validAt: responseToken.expiresInFourHours
    }
  }

  refreshToken = async (id: any) => {
    if (!id) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Para revalidação do TOKEN na API é obrigatório o envio do Identificador do usuário logado.`))
    }
    const filter = { _id: id, authType: AuthTypeEnum.API }
    const getAuth = await AuthRepository.getOne(filter)
    if (!getAuth) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Usuário não localizado, não será possível realizar a revalidação do TOKEN.`))
    }
    const responseToken = await Authentication.generateTokenApi(getAuth._id)
    return { 
      token: responseToken.token,
      validAt: responseToken.expiresInFourHours
    }
  }
  
  changePassword = async (id: any, body: any) => {
    if (!body?.currentPassword || !body?.newPassword) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Para alterar a senha do usuário é obrigatório o envio dos atributos: 'currentPassword' e 'newPassword'`))
    }
    const filter = { _id: id }
    const getAuth = await AuthRepository.getAuthWithHiddenAttributes(filter)
    if (!getAuth) {
        throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não foi possível realizar esta requisição, não foi localizado um registro para o identificador: ${id}`))
    }
    const currentPasswordInDataBase = await CryptUtil.decryptStringData({iv: getAuth?.["secretIv"], content: getAuth?.["secretKey"]})
    if (body.currentPassword != currentPasswordInDataBase) {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não foi possível realizar esta requisição, a senha atual informada é inválida.`))
    }
    const cryptoHash = await CryptUtil.encryptStringData(body.newPassword)
    let request: any
    if (cryptoHash instanceof Object && Object.keys(cryptoHash).length > 0) {
      request = {
        secretKey: cryptoHash.content,
        secretIv: cryptoHash.iv
      }
    } else {
      throw new AppError(null, CommonsUtil.factoryReturnObject(9, `Não foi possível realizar esta requisição, ocorreu um erro no processo de criptografia. Pro favor, tente novamente.`))
    }
    await AuthRepository.updateOne(filter, request)
    return CommonsUtil.factoryReturnObject(0, `A Senha do registro Id: '${id}' foi alterada com sucesso!`)
  }

}

export default new AuthService()