import { Response, Request } from 'express';

class HealthCheckController {
    public async healthcheck (req: Request, res: Response): Promise<Response> {
        return res.status(200).send("UP")
    }
}


export default new HealthCheckController()