import FileStream from 'fs'
import Path from 'path'

class CommonsUtil {

    factoryReturnController = (registers?: any[], entity?: string) => {
        const code = 0
        const message = "REQUISIÇÃO PROCESSADA COM SUCESSO!"
        const qtdRegisters = Array.isArray(registers) ? registers.length : 0
        let objectReturn = {
            code,
            message,
            returnDate: new Date(),
            ...(entity && { entity }),
            qtdRegisters,
            registers
        }
        return objectReturn
    }

    
    factoryRegexMongoose = (field: any) => {
        return field ? { $regex: '.*' + field + '.*' } : null
    }

    factoryReturnValueOrNull = (field: any) => {
        return this.factoryReturnValueOrUndefined(field) ? field : null
    }

    factoryReturnValueOrUndefined = (field: any) => {
      return field != undefined ? field : undefined
    }

    factoryReturnValueArray = (field: any) => {
        if (field != undefined) {
          if (field instanceof Array) {
            return field
          } else if (field.trim()) {
            return [field]
          }
        }
        return []
    }

    factoryElementMonthYear = (element: string, format: number, valid: boolean) => {
        let objectReturn = {
            element: element,
            format: format,
            valid: valid
        }
        return objectReturn
    }

    factoryReturnObject = (code: number, message: string) => {
        let objectReturn = {
            code: code,
            message: message 
        }
        return objectReturn
    }

    convertObjectToText = (object: any) => {
        return JSON.stringify(object).replace("{","").replace("}","").replace(/"/g,"'")
    }

    findOrCreateDirectory = async(pathName: string, dirName: string) => {
        const searchPath = `${pathName}/${dirName}`
        const searchedDir = Path.resolve(__dirname, searchPath)
        if (!FileStream.existsSync(searchedDir)) {
            FileStream.mkdirSync(searchedDir)
        }
        return searchedDir
    }

    insertQuotesInStringArray(values: any[]) {
        let output = '';
        for (let i = 0; i < values.length; i++) {
            if (i < values.length-1) {
                output += `'${values[i]}', `;
            } else {
                output += `'${values[i]}'`;
            }
        }
        return output
    }

    sleep = async(seg: number) => {
        return new Promise((resolve: any, reject: any) => {
            setTimeout(function() {
                resolve()
            }, seg * 1000)
        })
    }

    availableFile = async(file: string) => {
        return new Promise(async(resolve, reject) => {
            try {
            let wantedFile = FileStream.existsSync(file)
            if (wantedFile) {
                return resolve(true)
            }
            let numberAttempts = 0
            while(1) {
                console.log(`Verificando se o arquivo '${file}' está diponível na pasta. Tentativa: ${numberAttempts}`)
                await this.sleep(6)
                wantedFile = FileStream.existsSync(file)
                if (wantedFile) {
                return resolve(true)
                }
                if (!wantedFile && numberAttempts === 6) {
                return reject(false)
                }
                numberAttempts++
            }
            } catch (error) {
            console.log("Catch 'availableFile' -> Erro reportado: ", error.message)
                return reject(false)
            }
        })
    }
  

    sortObjectArray = (arrayList: any[], sortField: string, page?: number, sortDesc?: boolean) => {
        const newList = page > 0 ? arrayList.filter(element => element.page === page) : arrayList
        return newList.sort(function(indexOne: string,indexTwo: string){
          if (sortDesc) return indexOne?.[sortField] == indexTwo?.[sortField] ? 0 : indexOne?.[sortField] > indexTwo?.[sortField] ? -1 : 1
          return indexOne?.[sortField] == indexTwo?.[sortField] ? 0 : indexOne?.[sortField] > indexTwo?.[sortField] ? 1 : -1
        })
    }
  
    validateAndReturnNumericValue = (element: any) => {
        if (!element) return 0
        if (element.split(",").length > 1) {
            const newElement = Number(element.replace(/\./g, "").replace(",","."))
            if (typeof newElement === 'number' && !isNaN(newElement)) return Number(newElement)
        }
        if (Number(element)) {
            return Number(element)
        }
        return 0
    }

    convertStringDataInBoolean = (element: any) => {
        if (!element) return false
        if (typeof element ===  'string') {
            if (Boolean(element)) {
            return element === 'true' ?  true :  false
            }
        }
        if (typeof element ===  'boolean') {
            return element
        }
        return false
    }

}

export default new CommonsUtil()

