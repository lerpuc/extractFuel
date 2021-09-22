import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'
import PersonController from './controllers/PersonController'
import AuthController from './controllers/AuthController'
import Authentication from './authentication/Authentication'
import RequestsController from './controllers/RequestsController'
import SourceSystemController from './controllers/SourceSystemController'

const routes = Router()
routes.post('/auth/authApi', AuthController.authApi)

if (process.env.NODE_ENV.toString() !== 'development') routes.use('/', Authentication.validateTokenApi)

routes.get('/auth/refresh', AuthController.refreshToken)
routes.get('/auth/findAll', AuthController.index)
routes.post('/auth/create', AuthController.create)
routes.post('/auth/:id', AuthController.update)
routes.delete('/auth/:id', AuthController.delete)
routes.post('/auth/changePassword/:id', AuthController.changePassword)

routes.get('/person/findAll', PersonController.index)
routes.post('/person/create', PersonController.create)
routes.post('/person/:id', PersonController.update)
routes.delete('/person/:id', PersonController.delete)

routes.get('/source/findAll', SourceSystemController.index)
routes.post('/source/create', SourceSystemController.create)
routes.post('/source/:id', SourceSystemController.update)
routes.delete('/source/:id', SourceSystemController.delete)

routes.post('/services/extractDataFromSource', RequestsController.extractDataFromSource)

routes.use('/api', swaggerUi.serve);
routes.get('/api', swaggerUi.setup(swaggerDocument));

export default routes
