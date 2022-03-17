import { Request, Response } from 'express';

import { UserService } from './user.service';

export class UserController {
  protected userService!: InstanceType<typeof UserService>;

  constructor(Service: InstanceType<typeof UserService>) {
    this.userService = Service;
  }

  authenticate = async (req: Request, res: Response) => {
    const { body } = req;
    const response = await this.userService.authenticateUser(body);
    const { status, token, ...message } = response;
    return res.status(status).json(token ? { token } : message);
  };

  create = async (req: Request, res: Response) => {
    const { body } = req;
    const response = await this.userService.createUser(body);
    const { status, ...responseBody } = response;
    return res.status(status).json(responseBody);
  };
}
