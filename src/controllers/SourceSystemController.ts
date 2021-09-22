import { Request, Response } from 'express'
import SourceSystemService from '../service/SourceSystemService'
import CommonsUtil from '../utils/CommonsUtil';

class SourceSystemController {

  public async index (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'SourceSystemController' - Método: 'index'`
      );
      let filter: any
      if (Object.keys(req.query).length > 0) {
        filter = req.query
      }
      const sourceSystems = await SourceSystemService.index(filter)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'SourceSystemController' - Método: 'index'`
      );
      return res.json(CommonsUtil.factoryReturnController(sourceSystems, 'sourceSystem'))
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'SourceSystemController' - Método: 'index' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async create (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'SourceSystemController' - Método: 'create'`
      );
      const sourceSystem = await SourceSystemService.create(req.body)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'SourceSystemController' - Método: 'create'`
      );
      return res.json(sourceSystem)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'SourceSystemController' - Método: 'create' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'SourceSystemController' - Método: 'update'`
      );
      const {id} = req.params
      const body = req.body
      const sourceSystem = await SourceSystemService.update(id,body)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'SourceSystemController' - Método: 'update'`
      );
      return res.json(sourceSystem)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'SourceSystemController' - Método: 'update' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'SourceController' - Método: 'delete'`
      );
      const {id} = req.params
      const source = await SourceSystemService.delete(id)
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'SourceController' - Método: 'delete'`
      );
      return res.json(source)
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'SourceController' - Método: 'delete' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }

}

export default new SourceSystemController()