import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { Repository } from 'typeorm';
import { Child } from './entities/child.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChildrenService {

  constructor(
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
  ) {}

  async create(createChildDto: CreateChildDto, id: number) {
    const isExist = await this.childRepository.findBy({
      user: { id }
    })
    if (isExist.length >= 5) throw new BadRequestException ('Превышено максимальное количество детей')
    const newChild = {
      name: createChildDto.name,
      age: createChildDto.age,
      user: {id},
    }
    return await this.childRepository.save(newChild);
  }

  async findAll(id: number) {
    return id 
    
    ? await this.childRepository.find({
          where:  { user: {id} }
        })

    : await this.childRepository.find();
  }

  async findOne(id: number) {
    const child = await this.childRepository.findOne({
      where:  {id},
      relations: {
        user: true,
      }
    })
    if (!child) throw new NotFoundException ('Ребенок с таким id не найден')
    return child;
  }

  async update(id: number, updateChildDto: UpdateChildDto, user_id: number) {
    const child = await this.childRepository.findOne({
      where:  {id},
      relations: {
        user: true,
      }
    })
    if (!child) throw new NotFoundException ('Ребенок с таким id не найден')
    if (child.user.id != user_id) throw new ForbiddenException ('Вы не можете редактировать данные чужого ребенка')
    return await this.childRepository.update(id, updateChildDto);
  }

  async remove(id: number, user_id: number) {
    const child = await this.childRepository.findOne({
      where:  {id},
      relations: {
        user: true,
      }
    })
    if (!child) throw new NotFoundException ('Ребенок с таким id не найден')
    if (child.user.id != user_id) throw new ForbiddenException ('Вы не можете удалять данные чужого ребенка')
    return await this.childRepository.delete(id);
  }
}
