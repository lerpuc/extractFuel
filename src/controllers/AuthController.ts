import { Request, Response } from 'express'
import AuthService from '../service/AuthService'

class AuthController {

  public async index (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'AuthController' - Método: 'index'`
      );
      let filter: any
      if (Object.keys(req.query).length > 0) {
        filter = req.query
      }
      const auths = await AuthService.index(filter)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'AuthController' - Método: 'index'`
      );
      return res.json(auths)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'AuthController' - Método: 'index' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async create (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'AuthController' - Método: 'create'`
      );
      const auth = await AuthService.create(req.body)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'AuthController' - Método: 'create'`
      );
      return res.json(auth)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'AuthController' - Método: 'create' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'AuthController' - Método: 'update'`
      );
      const {id} = req.params
      const body = req.body
      const auth = await AuthService.update(id, body)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'AuthController' - Método: 'update'`
      );
      return res.json(auth)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'AuthController' - Método: 'update' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'AuthController' - Método: 'delete'`
      );
      const {id} = req.params
      const auth = await AuthService.delete(id)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'AuthController' - Método: 'delete'`
      );
      return res.json(auth)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'AuthController' - Método: 'delete' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async authApi (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'AuthController' - Método: 'authApi'`
      );
      const body = req.body
      const auth = await AuthService.authApi(body)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'AuthController' - Método: 'authApi'`
      );
      return res.json(auth)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'AuthController' - Método: 'authApi' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async refreshToken (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'AuthController' - Método: 'refreshToken'`
      );
      const id = req.headers.authId
      const auth = await AuthService.refreshToken(id)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'AuthController' - Método: 'refreshToken'`
      );
      return res.json(auth)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'AuthController' - Método: 'refreshToken' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async changePassword (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'AuthController' - Método: 'changePassword'`
      );
      const {id} = req.params
      const body = req.body
      const auth = await AuthService.changePassword(id,body)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'AuthController' - Método: 'changePassword'`
      );
      return res.json(auth)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'AuthController' - Método: 'changePassword' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

}

export default new AuthController()
