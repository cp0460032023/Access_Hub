import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { AuditModule } from '../audit/audit.module';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuditModule],
  controllers: [UsersController],
  providers: [UsersService, CaslAbilityFactory, Reflector],
  exports: [UsersService],
})
export class UsersModule {}


