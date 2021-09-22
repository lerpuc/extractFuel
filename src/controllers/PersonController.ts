import { Request, Response } from 'express'
import PersonService from '../service/PersonService'
import CommonsUtil from '../utils/CommonsUtil';

class PersonController {

  public async index (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'PersonController' - Método: 'index'`
      );
      let filter: any
      if (Object.keys(req.query).length > 0) {
        filter = req.query
      }
      const persons = await PersonService.index(filter)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'PersonController' - Método: 'index'`
      );
      return res.json(CommonsUtil.factoryReturnController(persons, 'person'))
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'PersonController' - Método: 'index' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async create (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'PersonController' - Método: 'create'`
      );
      const person = await PersonService.create(req.body)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'PersonController' - Método: 'create'`
      );
      return res.json(person)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'PersonController' - Método: 'create' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'PersonController' - Método: 'update'`
      );
      const {id} = req.params
      const body = req.body
      const person = await PersonService.update(id,body)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'PersonController' - Método: 'update'`
      );
      return res.json(person)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'PersonController' - Método: 'update' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'PersonController' - Método: 'delete'`
      );
      const {id} = req.params
      const person = await PersonService.delete(id)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'PersonController' - Método: 'delete'`
      );
      return res.json(person)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'PersonController' - Método: 'delete' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }
  
}

export default new PersonController()
