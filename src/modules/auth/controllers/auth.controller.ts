import { ILoginDTO } from '@auth/dtos';
import { AuthService } from '@auth/services';
import { Request, Response } from 'express';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response): Promise<void> {
    const data: ILoginDTO = req.body;
    const response = await this.authService.login(data);
    res.status(200).json(response);
  }
}
