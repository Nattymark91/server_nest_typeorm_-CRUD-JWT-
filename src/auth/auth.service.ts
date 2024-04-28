import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor( 
    private readonly userService: UsersService, 
    private readonly jwtService: JwtService 
    ) {}

  async validateUser(id: number, password: string) {
    const user = await this.userService.findOne(id)
    const passwordIsMatch = await argon2.verify(user.password, password)
    if (user && passwordIsMatch) {
      return user
    }
    throw new BadRequestException('Не верный логин или пароль')
  }

  async login(user: IUser) {
    const { id, name} = user
    return {
      id, 
      name, 
      token: this.jwtService.sign({ id: user.id, name: user.name }),
    };
  }
}
