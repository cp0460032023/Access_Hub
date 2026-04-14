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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { Action } from '../casl/casl-ability.factory';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

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
      return { message: 'No tienes permisos para crear usuarios', statusCode: 403 };
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
      return { message: 'No tienes permisos para ver usuarios', statusCode: 403 };
    }
    return this.usersService.findAll(+page, +limit, search, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Read, 'User')) {
      return { message: 'No tienes permisos para ver este usuario', statusCode: 403 };
    }
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Update, 'User')) {
      return { message: 'No tienes permisos para editar usuarios', statusCode: 403 };
    }
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Delete, 'User')) {
      return { message: 'No tienes permisos para eliminar usuarios', statusCode: 403 };
    }
    return this.usersService.removeUser(id);
  }
}