import {
  JsonController,
  Param,
  Res,
  Body,
  Get,
  Post,
  Put,
  Delete,
  UseBefore,
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { CheckJwt } from '../middlewares/CheckJwt';
import User from '../models/User';
import { USER_DEFAULT_SELECT } from '../utils/constants';

@JsonController()
export default class UserController {
  @Get('/users')
  @UseBefore(CheckJwt)
  getAll() {
    return getRepository(User).find({
      select: <(keyof User)[]>USER_DEFAULT_SELECT,
      relations: ['pets'],
    });
  }

  @Get('/users/:id')
  @UseBefore(CheckJwt)
  async getOne(@Param('id') id: number, @Res() res: any) {
    const userRepository = getRepository(User);
    try {
      return await userRepository.findOneOrFail(id, {
        select: <(keyof User)[]>USER_DEFAULT_SELECT,
        relations: ['pets'],
      });
    } catch (error) {
      return res.status(404).send('User not found');
    }
  }

  @Post('/users')
  async post(@Body() userData: any, @Res() res: any) {
    let user = new User();
    user = Object.assign(user, userData);
    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    user.hashPassword();
    const userRepo = getRepository(User);
    try {
      user = await userRepo.save(user);
    } catch (error) {
      return res.status(409).send('Phone already in use');
    }
    return user;
  }

  @Put('/users/:id')
  @UseBefore(CheckJwt)
  async put(@Param('id') id: number, @Body() userData: any, @Res() res: any) {
    const userRepo = getRepository(User);
    let user;
    try {
      user = await userRepo.findOneOrFail(id);
    } catch (error) {
      return res.status(404).send('User not found');
    }
    user = { ...user, ...userData };
    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      user = await userRepo.save(user);
    } catch (error) {
      return res.status(409).send('Phone already in use');
    }
    return user;
  }

  @Delete('/users/:id')
  @UseBefore(CheckJwt)
  async remove(@Param('id') id: number, @Res() res: any) {
    const userRepository = getRepository(User);
    try {
      const user: User = await userRepository.findOneOrFail(id);
      return userRepository.delete(user.id);
    } catch (error) {
      return res.status(404).send('User not found');
    }
  }
}
