import CommonsUtil from "./CommonsUtil"

class DateUtil {

    parseDateBrToEnglish = (date: string) => {
        let newDateTime = new Date()
        let newDate = ''
        if (date.indexOf('/') === 2) {
            const strData = date.split('/')
            newDate = `${strData[2]}-${strData[1]}-${strData[0]} 12:00`
            newDateTime = new Date(newDate)
        } else if (date.indexOf('/') === 4) {
            const strData = date.split('/')
            newDate = `${strData[0]}-${strData[1]}-${strData[2]} 12:00`
            newDateTime = new Date(newDate)
        } else if (date.indexOf('/') === -1) {
            const lastPosition = date.indexOf("T") > -1 ? date.indexOf("T") : 11
            const strData = date.substring(0, lastPosition) 
            const strDate = new Date(strData)
            if(strDate.getTime()) {
                newDateTime = strDate
            }
        }
        return newDateTime
    }


    validateDateFormatInEnglish = (date: string) => {
        let responseDate = null
        if (date) {
          const splitDate = date.split('-')
          if (splitDate.length ===  3) {
            if (splitDate[0].length === 4 && splitDate[1].length === 2 && splitDate[2].length === 2) {
              const dateValid = new Date(date)
              if (dateValid.getTime()) {
                if (date === dateValid.toJSON().substring(0,10)) {
                  responseDate = date
                }
              }
            }
          }
        }
        return responseDate
    }

    sortArrayMonthYear = (listMonthYear: string[], returnInvalid?: boolean, sortDesc?: boolean) => {
        if (listMonthYear.length <= 1) {
            return listMonthYear
        }
        const notValidList = [] as string[]
        const validList = [] as any[]
        listMonthYear.map(elementNew => {
          if (elementNew) {
            const returnElement = this.returnElementMonthYear(elementNew)
            if (returnElement?.["valid"]) {
                validList.push(returnElement)
            } else {
                if (returnInvalid) {
                    notValidList.push(elementNew)
                }
            }
          } else {
            if (returnInvalid) {
              notValidList.push(elementNew)
            }
          }
        })
        validList.sort(function(indexOne: string,indexTwo: string){
            let dateOne = new Date(indexOne?.["element"])
            let dateTwo = new Date(indexTwo?.["element"])
            if (sortDesc) {
                return dateOne == dateTwo ? 0 : dateOne > dateTwo ? -1 : 1
            }
            return dateOne == dateTwo ? 0 : dateOne > dateTwo ? 1 : -1
        })
        const response = validList.map(elementList => {
            const datas = elementList.element.split("-")
            if (elementList?.["format"] === 0) {
                return `${datas[1]}/${datas[0]}`
            } else if (elementList?.["format"] === 1) {
                return `${datas[0]}/${datas[1]}`
            } else if (elementList?.["format"] === 2) {
                return `${datas[1]}-${datas[0]}`
            } else {
                return `${datas[0]}-${datas[1]}`
            }
        })
        if (notValidList.length > 0) {
            response.push(...notValidList)
        }
        return response
    }

    returnElementMonthYear = (elementNew: string) => {
        const datas = elementNew.split("/")
        let element = elementNew
        if (elementNew.indexOf("/") === 2 && datas.length === 2) {
            if (Number(datas[0]) >= 1 && Number(datas[0]) <= 12 && Number(datas[1])) {
                element = `${datas[1]}-${datas[0]}-01`
                return CommonsUtil.factoryElementMonthYear(element, 0, true)
            } else {
                return CommonsUtil.factoryElementMonthYear(element, 0, false)
            }
        } else if (elementNew.indexOf("/") === 4 && datas.length === 2) {
            if (Number(datas[1]) >= 1 && Number(datas[1]) <= 12 && Number(datas[0])) {
                element = `${datas[0]}-${datas[1]}-01`
                return CommonsUtil.factoryElementMonthYear(element, 1, true)
            } else {
                return CommonsUtil.factoryElementMonthYear(element, 1, false)
            }
        } else {
            const newData = elementNew.split("-")
            if (elementNew.indexOf("-") === 2 && newData.length === 2) {
                if (Number(newData[0]) >= 1 && Number(newData[0]) <= 12 && Number(newData[1])) {
                    element = `${newData[1]}-${newData[0]}-01`
                    return CommonsUtil.factoryElementMonthYear(element, 2, true)
                } else {
                    return CommonsUtil.factoryElementMonthYear(element, 2, false)
                }
            } else if (elementNew.indexOf("-") === 4 && newData.length === 2) {
                if (Number(newData[1]) >= 1 && Number(newData[1]) <= 12 && Number(newData[0])) {
                    element = `${newData[0]}-${newData[1]}-01`
                    return CommonsUtil.factoryElementMonthYear(element, 3, true)
                } else {
                    return CommonsUtil.factoryElementMonthYear(element, 3, false)
                }
            } else {
                return CommonsUtil.factoryElementMonthYear(element, -1, false)
            }
        }
    }

    setExpirationHours = (hour: number) => {
        const todayNow = new Date(new Date().setUTCHours(new Date().getUTCHours()-3))
        return new Date(todayNow.setUTCHours(todayNow.getUTCHours()+hour))
    }

    getSecondsPerHour = (hours: number) => {
        return Number(60*60*hours)
    }

    getCurrentMonthYear = () => {
        const today = new Date()
        const month = today.getUTCMonth() < 9 ? `0${today.getUTCMonth()+1}` : `${today.getUTCMonth()}`
        return `${month}/${today.getFullYear()}`
    }

    getLastMonthYear = () => {
        const today = new Date().toJSON().substring(0,10)
        const currentYear = new Date(today).getUTCFullYear()
        let currentMonth = new Date(today).getUTCMonth()+1
        if (currentMonth === 1) {
            return `12/${currentYear-1}`
        }
        currentMonth--
        const month = (currentMonth) < 9 ? `0${currentMonth}` : `${currentMonth}`
        return `${month}/${currentYear}`
    }
  
    convertDateToStringWithSeparator = (date: Date, separator: string, format?: string) => {
        const day = date.getUTCDate() <= 9 ? `0${date.getUTCDate()}` : `${date.getUTCDate()}`
        const month = date.getUTCMonth() < 9 ? `0${date.getUTCMonth()+1}` : `${date.getUTCMonth()}`
        const year = date.getUTCFullYear()
        if (format === 'br') return String(`${day}${separator}${month}${separator}${year}`)
        return String(`${year}${separator}${month}${separator}${day}`)
    }

}

export default new DateUtil()
