import { JsonController, Body, Post, Res } from 'routing-controllers';
import { getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import config from '../utils/config';
import User from '../models/User';

@JsonController()
export default class AuthController {
  @Post('/auth')
  async post(@Body() authData: any, @Res() res: any) {
    const { phone, password } = authData;

    if (!(phone && password)) {
      res.status(400).send();
    }
    const userRepo = getRepository(User);
    let user: User;
    try {
      user = await userRepo.findOneOrFail({ phone: phone });
    } catch (error) {
      res.status(401).send();
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return res.status(401).send();
    }

    const token = jwt.sign(
      { userId: user.id, userPhone: user.phone },
      config.jwtSecret,
      { expiresIn: '730h' },
    );

    res.send(token);
  }
}
