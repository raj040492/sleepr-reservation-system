import {
  Injectable,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user-dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  @Post()
  async create(body: CreateUserDto) {
    await this.validateCreateUserDto(body);
    return this.repo.create({
      ...body,
      password: await bcrypt.hash(body.password, 10),
    });
  }

  private async validateCreateUserDto(body: CreateUserDto) {
    try {
      await this.repo.findOne({ email: body.email });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // if no user exists with email, error will be thrown.
      // this is ok for us, since we are creating a new user.
      // so we catch the error and return;
      return;
    }
    throw new UnprocessableEntityException('Email already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.repo.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async getUser(body: GetUserDto) {
    return this.repo.findOne(body);
  }
}
