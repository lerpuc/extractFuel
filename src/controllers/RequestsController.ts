import { Request, Response } from 'express'
import RequestsService from '../service/RequestsService'
import CommonsUtil from '../utils/CommonsUtil';

class RequestsController {
  
  public async extractDataFromSource (req: Request, res: Response): Promise<Response> {
    const objectRequest = req.body;
    try {
      console.log(
        `${new Date().toUTCString()}        ---- EXECUÇÃO do CONTROLLER 'RequestsController' - Método: 'extractDataFromSource'`
      );
      const returnData = await RequestsService.requestExtractDataFromSource(objectRequest)
      
      console.log(
        `${new Date().toUTCString()}        ---- RETURN do CONTROLLER 'RequestsController' - Método: 'extractDataFromSource'`
      );
      return res.json(CommonsUtil.factoryReturnController(returnData, 'service'))
    } catch (error) {
      let returnError = error.message
      if (error.data) {
        returnError = error.data
      }
      console.log(
        `${new Date().toUTCString()}        ---- CATCH do CONTROLLER 'RequestsController' - Método: 'extractDataFromSource' - Erro: ${returnError}`
      );
      return res.status(error.httpCode || 400).send(returnError);
    }
  }
}

export default new RequestsController()
