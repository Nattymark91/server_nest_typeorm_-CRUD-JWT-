import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createChildDto: CreateChildDto, @Req() req) {
    return this.childrenService.create(createChildDto, +req.user.id);
  }

  @Get()
  findAll(@Query('user') user:number) {
    return this.childrenService.findAll(+user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.childrenService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string, 
    @Body() updateChildDto: UpdateChildDto, 
    @Req() req
    ) {
    return this.childrenService.update(+id, updateChildDto, +req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.childrenService.remove(+id, +req.user.id);
  }
}
