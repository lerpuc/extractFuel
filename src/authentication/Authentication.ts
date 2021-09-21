import { Request, Response } from 'express'
import { NextFunction } from "express";
import JWT from 'jsonwebtoken'
import CommonsUtil from '../utils/CommonsUtil';
import DateUtil from '../utils/DateUtil';

class Authentication {

    public async validateTokenApi (req: Request, res: Response, next: NextFunction) {
        if (JSON.parse(process.env.NOT_AUTHENTICATE)) {
            return next()
        }
        if (req.originalUrl.includes("/api")) {
            return next()
        }
        if (!req.headers.authorization) {
            return res.status(401).send(CommonsUtil.factoryReturnObject(9, 'Esta requisição requer autenticação via TOKEN. Favor realizar a autenticação na API.'));
        }
        const authHeader = req.headers.authorization
        const partsAuth = authHeader.split(' ')
        if (partsAuth.length !== 2) {
            return res.status(401).send(CommonsUtil.factoryReturnObject(9, 'Token informado é inválido.'));
        }
        const [ schema, token ] = partsAuth
        if (!/^Bearer$/i.test(schema)) {
            return res.status(401).send(CommonsUtil.factoryReturnObject(9, `Formato do TOKEN inválido, é esperado um padrão 'bearer' token`));
        }
        try {
            const decoded = JWT.verify(token, process.env.TOKEN_HASH)    
            req.headers.authId = decoded?.["authId"]
        } catch (error) {
            return res.status(401).send(CommonsUtil.factoryReturnObject(9, 'Token inválido ou expirado, favor autenticar novamente.'))
        }
        next()
    }

    generateTokenApi = async (authId: any) => {
        const hours = Number(process.env.TOKEN_EXPIRES_HOUR)
        const expiresIn = DateUtil.getSecondsPerHour(hours)
        const token = JWT.sign({ authId }, process.env.TOKEN_HASH, {
            expiresIn
        })
        const expiresInFourHours = DateUtil.setExpirationHours(hours)
        return {token, expiresInFourHours}
    }
}

export default new Authentication()