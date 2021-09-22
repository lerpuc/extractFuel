import Puppeteer from 'puppeteer'
import FileStream from 'fs'
import Path from 'path'
import AppError from '../utils/AppErrorUtil'
import CommonsUtil from '../utils/CommonsUtil'
import { SourceSystemInterface } from '../interfaces/SourceSystemInterface'
import { CustomersDataInterface, CustomersProductsInterface } from '../interfaces/CustomersDataInterface'
import LocaleBrUtil from '../utils/LocaleBrUtil'

class FuelCrawler {

    getDatasFromSource = async (source: SourceSystemInterface, filters?: any) => {
      const customerData = [] as CustomersDataInterface[]

      try {
        const CpfCnpjSearch = CommonsUtil.factoryReturnValueOrNull(filters?.filters?.["documentNumber"])

        // recuperar os dados de autenticação do ACCCOUNT para realizar o acesso ao sistema do SOURCE
        const urlAuth = source.configr.loginSystemUrl
        const browser = await Puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(urlAuth);
        console.log("Sistema vai realizar a consulta")
        page.setDefaultTimeout(150000)
        await page.evaluate((CpfCnpjSearch) => {
          (document as any).querySelector("body > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(3) > table:nth-child(2) > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input").value = CpfCnpjSearch
        }, CpfCnpjSearch)
        await page.evaluate(() => {
          (document as any).querySelector("body > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(3) > table:nth-child(2) > tbody > tr > td > form > table > tbody > tr:nth-child(7) > td:nth-child(3) > input[type=button]:nth-child(3)").click()
        })
        const elementWait = 'body > table > tbody > tr > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > font > font > b'
        await page.waitForSelector(elementWait)
        let messageRetorno = null
        try {
          messageRetorno = await page.evaluate(() => {
            return (document as any).querySelector('body > table > tbody > tr > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(2) > td > font > b').innerHTML
          })
        } catch (error) {}

        if (messageRetorno) {
          await browser.close();
          throw new AppError(null,CommonsUtil.factoryReturnObject(9, messageRetorno))
        }

        const results = await this.getListResultSearch(page)
        const itemToExtract = [] as any[]
        results.map(itemResult => {
          if (Object.keys(itemResult).length > 0) {
            const indexToClick = Number(Object.keys(itemResult)[0])+1
            const documentToClick = Object.values(itemResult)[0]
            itemToExtract.push({
              index: indexToClick,
              document: documentToClick
            })
          }
        })
        
        for (const item of itemToExtract) {
          const itemClick = item?.index
          await page.evaluate((itemClick: number) => {
            (document as any).querySelector(`body > table > tbody > tr > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(${itemClick}) > td:nth-child(1) > font > input[type=button]:nth-child(2)`).click()
          }, itemClick)
          const elementWait = 'body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(3) > tbody > tr > td > div > table:nth-child(1) > tbody > tr:nth-child(1) > td > font > b > a'
          await page.waitForSelector(elementWait)
          await page.waitForTimeout(1000)
          const resultPage = await this.getContentPage(page)
          const resultProducts = await this.getContentProducts(page)
          const returnCustomer = await this.checkValidRegisterToExtract(resultPage, resultProducts)
          customerData.push(returnCustomer)
          await page.waitForTimeout(1000)
          //retorna
          await page.evaluate(() => {
            (document as any).querySelector("body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(3) > tbody > tr > td > div > table:nth-child(1) > tbody > tr:nth-child(1) > td > font > b > a").click()
          })
        }
      
        await browser.close();

        return customerData
      } catch (error) {
        console.log(`CATCH do CRAWLER 'FuelCrawler' - Método: 'getDatasFromSource' - Erro: ${error.message}`)
        throw error
      }
    }

    checkValidRegisterToExtract = async(resultPage: any[], resultProducts:  any[]) => {
      const authorization = Object.values(resultPage[0])[0]
      const documentNumber = Object.values(resultPage[1])[0]
      const name = Object.values(resultPage[2])[0]
      const socialName = Object.values(resultPage[3])[0]
      const address = Object.values(resultPage[4])[0]
      const complement = Object.values(resultPage[5])[0]
      const neighborhood = Object.values(resultPage[6])[0]
      const cityState = Object.values(resultPage[7])[0]
      const zipCode = Object.values(resultPage[8])[0]
      const dispatchNumber = Object.values(resultPage[9])[0]
      const publicationDate = Object.values(resultPage[10])[0]
      const flagStart = Object.values(resultPage[11])[0]
      const postType = Object.values(resultPage[12])[0]
      const partners = String(Object.values(resultPage[13])[0]).split('\n')
      const products = [] as CustomersProductsInterface[]
      resultProducts.map(itemProduct => {
        products.push(
          {
            product: Object.keys(itemProduct)[0],
            tancagem: Number(Object.values(itemProduct)[0][0]),
            nozzles: Number(Object.values(itemProduct)[0][1])
          }
        )
      })
      return { 
        authorization,
        documentNumber,
        name,
        socialName,
        address,
        complement,
        neighborhood,
        cityState,
        zipCode,
        dispatchNumber,
        publicationDate,
        flagStart,
        postType,
        partners,
        products
      } as CustomersDataInterface
  }

    getListResultSearch = async(page: any) => {
      const results = await page.evaluate(() => {
        const documents = [] as any[]
        document
        .querySelectorAll('body > table > tbody > tr > td:nth-child(2) > table:nth-child(4) > tbody')
        .forEach(content => {
          content.querySelectorAll('tr').forEach((element: any, index: number) => {
            const item = (element as any).firstElementChild.firstElementChild.lastElementChild
            if (item) {
              documents.push({[index]: item.value})
            }
          })
        })
        return documents
      }) as []
      return results
    }

    getContentPage = async(page: any) => {
      const results = await page.evaluate(() => {
        const documents = [] as any[]
        document
        .querySelectorAll('body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(3) > tbody > tr > td > div > table:nth-child(1) > tbody')
        .forEach(content => {
          content.querySelectorAll('tr').forEach(element => {
            if (element.childElementCount > 1) {
              const index = (element as any).firstElementChild.lastElementChild.innerText
              const item = (element as any).lastElementChild.innerText
              if (item) {
                documents.push({[index]: item})
              }
            }
          })
        })
        return documents
      }) as []
      return results
    }

    getContentProducts = async(page: any) => {
      const results = await page.evaluate(() => {
        const documents = [] as any[]
        document
        .querySelectorAll('body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(3) > tbody > tr > td > div > table:nth-child(3) > tbody')
        .forEach(content => {
          content.querySelectorAll('tr').forEach((element:any, indexTr:number) => {
            if (indexTr > 1) {
              let contentIndex = ""
              const registers = [] as any[]
              element.querySelectorAll('td').forEach((items:any, indexTd:number) => {
                if (indexTd === 0 && items.innerText.length > 0 ){
                  contentIndex = items.innerText
                } else {
                  registers.push(items.innerText)
                }
              })
              if (contentIndex.length > 0) {
                documents.push({[contentIndex]: registers})
              }
            }
          })
        })
        return documents
      }) as []
      return results
    }
}

export default new FuelCrawler()