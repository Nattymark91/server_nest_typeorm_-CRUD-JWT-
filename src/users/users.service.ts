import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {name: createUserDto.name},
    })
    if(existUser) throw new BadRequestException('Пользователь с таким именем уже зарегистрирован')
    const user = await this.userRepository.save({
      name: createUserDto.name,
      password: await argon2.hash(createUserDto.password),
      age: createUserDto.age
    })
    const { id, name} = user
    const token = this.jwtService.sign({ id: user.id, name: user.name})

    return {
      id, 
      name, 
      token
    };
  }

  async findAll() {
    return await this.userRepository.find()
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: {id: id},
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto, user_id: number) {
    const user = await this.userRepository.findOne({
      where: {id}
    })
    if (!user) throw new NotFoundException ('Пользователь с таким id не найден')
    if (user.id != user_id) throw new ForbiddenException ('Вы не можете редактировать данные другого пользователя')
    return await this.userRepository.update(id, updateUserDto);
  }
}
