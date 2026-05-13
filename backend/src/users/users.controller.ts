import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Action, CaslAbilityFactory } from '../casl/casl-ability.factory';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Create, 'User')) {
      throw new ForbiddenException('No tienes permisos para crear usuarios');
    }
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('role') role?: string,
    @Request() req?,
  ) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Read, 'User')) {
      throw new ForbiddenException('No tienes permisos para ver usuarios');
    }
    return this.usersService.findAll(+page, +limit, search, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Read, 'User')) {
      throw new ForbiddenException('No tienes permisos para ver este usuario');
    }
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Update, 'User')) {
      throw new ForbiddenException('No tienes permisos para editar usuarios');
    }
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch(':id/password')
  changePassword(
    @Param('id') id: string,
    @Body() body: { currentPassword: string; newPassword: string },
    @Request() req,
  ) {
    return this.usersService.changePassword(id, body.currentPassword, body.newPassword);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Delete, 'User')) {
      throw new ForbiddenException('No tienes permisos para eliminar usuarios');
    }
    return this.usersService.removeUser(id);
  }
}
