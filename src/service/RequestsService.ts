import FuelCrawler from "../crawlers/FuelCrawler"
import { CustomersDataInterface } from "../interfaces/CustomersDataInterface"
import { SourceSystemInterface } from "../interfaces/SourceSystemInterface"
import SourceSystemService from "./SourceSystemService"

class RequestsService {

  getGeneralInformation = async (filters: any) => {
    try {
        // recuperar o source system origem onde será realizado a extração dos dados
        const source = await SourceSystemService.getSourceValid(filters)
        // retorna o método com os dados processados
        return { sourceSystem: source }
    } catch (error) {
        throw error
    }
  }
  
  requestExtractDataFromSource = async (filters: any, schedule?: boolean) => {
    try {
      // obter todas as entidades mandatórias para execução deste serviço
      const generalInformations = await this.getGeneralInformation(filters)

      // setar os filtros para suas respectivas variaveis, conforme os dados obtidos no método acima
      const source = generalInformations.sourceSystem as SourceSystemInterface
      
      // faz o roteamento dinâmico conforme o SOURCE da requisição
      const extractedData = await this.routeSourceCrawler(source.sourceKey, source, filters)

      return extractedData
    } catch (error) {
        throw error
    }
  }

  routeSourceCrawler = async(sourceKey: string, source: any, account: any, filters?: any) => {
    const findSourceRoute = {
      ANP: this.executeFuelCrawler
    };
    const validSourcesKey = findSourceRoute[sourceKey] ? sourceKey : null
    let response = [] as CustomersDataInterface[]
    if (validSourcesKey) {
      response = (await findSourceRoute[validSourcesKey](source, account, filters)) as any[]
    }
    return response
  }

  executeFuelCrawler = async(source: any, filters?: any) => {
    // executa a extração dos dados no site do SOURCE: ANP
    return await FuelCrawler.getDatasFromSource(source, filters)
  }

}

export default new RequestsService()