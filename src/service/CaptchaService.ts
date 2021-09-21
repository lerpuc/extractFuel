import Request from 'request'
import CaptchaConfig from '../CaptchaConfig'
import AppError from '../utils/AppErrorUtil'
import CommonsUtil from '../utils/CommonsUtil'

class CaptchaService {

    getTokenByCaptcha = async (siteUrl: string, siteKey: string): Promise<string> => {
        try {
            const response = await this.resolveCaptcha(siteUrl, siteKey)
            if (response?.["status"] != 1) {
                throw new AppError(null, CommonsUtil.factoryReturnObject(6, `Erro resportado: ${response}`))
            }
            return response?.["request"]
        } catch (error) {
            throw new AppError(null, CommonsUtil.factoryReturnObject(6, `Erro resportado: ${error.error_text}`))
        }
    }

    resolveCaptcha = async(siteUrl: string, siteKey: string) => {
        return new Promise(async(resolve, reject) => {
            try {
                const requestUrlForCaptcha = `https://2captcha.com/in.php?key=${CaptchaConfig.apiKey}&json=true&method=userrecaptcha&googlekey=${siteKey}&pageurl=${siteUrl}`
                const response = await this.curl({
                    method: 'GET',
                    url: requestUrlForCaptcha
                }) as any
                const datasToRequestToken = JSON.parse(response)
                if (datasToRequestToken.status != 1) {
                    return reject(datasToRequestToken)
                }
                const captchaId = datasToRequestToken?.request
                while(1) {
                    await CommonsUtil.sleep(15)
                    console.log("Verificando se o captcha está pronto")
                    const responseToken = await this.curl({
                        method: 'GET',
                        url: `https://2captcha.com/res.php?key=${CaptchaConfig.apiKey}&action=get&id=${captchaId}&json=true`
                    }) as any
                    const dataToken = JSON.parse(responseToken)
                    if (dataToken.status == 1) {
                        return resolve(dataToken)
                    }
                    if (dataToken.request != 'CAPCHA_NOT_READY') {
                        return reject(dataToken)
                    }
                }
            } catch (error) {
                return reject(error)
            }
        })
    }

    curl = async(options: any) => {
        return new Promise((resolve: any, reject: any) => {
            Request(options, (err, res, body) => {
                if (err) {
                    return reject(err)
                }
                resolve(body)
            })
        })
    }

}

export default new CaptchaService()