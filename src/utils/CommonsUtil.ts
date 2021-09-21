import FileStream from 'fs'
import Path from 'path'

class CommonsUtil {

    factoryRegexMongoose = (field: any) => {
        return field ? { $regex: '.*' + field + '.*' } : null
    }

    factoryReturnValueOrNull = (field: any) => {
        return field ? field : null
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

}

export default new CommonsUtil()

