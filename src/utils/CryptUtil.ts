import Crypto from 'crypto'
import CryptoConfig from '../CryptoConfig'

class CryptUtil {

    encryptStringData = async(dataToEncrypt: string) => {
        if (!dataToEncrypt) {
            return {}
        }
        const iv = Crypto.randomBytes(16);
        const cipher = Crypto.createCipheriv(CryptoConfig.algorithm, CryptoConfig.key, iv);
        const encrypted = Buffer.concat([cipher.update(dataToEncrypt), cipher.final()]);
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        }
    }

    decryptStringData = async(hash: any) => {
        const decipher = Crypto.createDecipheriv(CryptoConfig.algorithm, CryptoConfig.key, Buffer.from(hash.iv, 'hex'));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
        return decrpyted.toString();
    }

}

export default new CryptUtil()
