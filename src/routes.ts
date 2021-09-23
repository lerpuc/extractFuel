import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'
import PersonController from './controllers/PersonController'
import AuthController from './controllers/AuthController'
import Authentication from './authentication/Authentication'
import RequestsController from './controllers/RequestsController'
import SourceSystemController from './controllers/SourceSystemController'
import HealthCheckController from './controllers/HealthCheckController'
const routes = Router()
routes.post('/auth/authApi', AuthController.authApi)

if (process.env.NODE_ENV.toString() !== 'development') routes.use('/', Authentication.validateTokenApi)

routes.get('/extract/v1/auth/refresh', AuthController.refreshToken)
routes.get('/extract/v1/auth/findAll', AuthController.index)
routes.post('/extract/v1/auth/create', AuthController.create)
routes.post('/extract/v1/auth/:id', AuthController.update)
routes.delete('/extract/v1/auth/:id', AuthController.delete)
routes.post('/extract/v1/auth/changePassword/:id', AuthController.changePassword)

routes.get('/extract/v1/person/findAll', PersonController.index)
routes.post('/extract/v1/person/create', PersonController.create)
routes.post('/extract/v1/person/:id', PersonController.update)
routes.delete('/extract/v1/person/:id', PersonController.delete)

routes.get('/extract/v1/source/findAll', SourceSystemController.index)
routes.post('/extract/v1/source/create', SourceSystemController.create)
routes.post('/extract/v1/source/:id', SourceSystemController.update)
routes.delete('/extract/v1/source/:id', SourceSystemController.delete)

routes.post('/extract/v1/services/extractDataFromSource', RequestsController.extractDataFromSource)

routes.get('/extract/v1/healthcheck',HealthCheckController.healthcheck)

routes.use('/api', swaggerUi.serve);
routes.get('/api', swaggerUi.setup(swaggerDocument));

export default routes
