import { ExpressMiddlewareInterface } from 'routing-controllers';
import * as jwt from 'jsonwebtoken';
import config from '../utils/config';

export class CheckJwt implements ExpressMiddlewareInterface {
  // interface implementation is optional

  use(req: any, res: any, next?: (err?: any) => any): any {
    const token = <string>req.headers['authorization'];
    let jwtPayload;
    try {
      jwtPayload = <any>jwt.verify(token, config.jwtSecret);
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      return res.status(401).send('Token is invalid');
    }
    const { userId, userPhone } = jwtPayload;
    const newToken = jwt.sign({ userId, userPhone }, config.jwtSecret, {
      expiresIn: '730h',
    });
    res.setHeader('token', newToken);
    next();
  }
}
