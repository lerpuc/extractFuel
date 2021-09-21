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

    sortArrayMonthYear = (listMonthYear: string[], returnInvalid?: boolean, sortDesc?: boolean) => {
        if (listMonthYear.length <= 1) {
            return listMonthYear
        }
        const notValidList = [] as string[]
        const validList = [] as string[]
        let returnElement = {}
        listMonthYear.map(elementNew => {
            returnElement = this.returnElementMonthYear(elementNew)
            if (returnElement?.["valid"]) {
                validList.push(returnElement?.["element"])
            } else {
                if (returnInvalid) {
                    notValidList.push(elementNew)
                }
            }
        })
        validList.sort(function(indexOne: string,indexTwo: string){
            let dateOne = new Date(indexOne)
            let dateTwo = new Date(indexTwo)
            if (sortDesc) {
                return dateOne == dateTwo ? 0 : dateOne > dateTwo ? -1 : 1
            }
            return dateOne == dateTwo ? 0 : dateOne > dateTwo ? 1 : -1
        })
        const response = validList.map(elementList => {
            const datas = elementList.split("-")
            if (returnElement?.["format"] === 0) {
                return `${datas[1]}/${datas[0]}`
            } else if (returnElement?.["format"] === 1) {
                return `${datas[0]}/${datas[1]}`
            } else if (returnElement?.["format"] === 2) {
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

}

export default new DateUtil()
