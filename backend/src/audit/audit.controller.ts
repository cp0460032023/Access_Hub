import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuditService } from './audit.service';
import { CaslAbilityFactory, Action } from '../casl/casl-ability.factory';

@Controller('audit')
@UseGuards(AuthGuard('jwt'))
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('action') action?: string,
    @Query('search') search?: string,
    @Request() req?,
  ) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Manage, 'all')) {
      throw new ForbiddenException(
        'Solo los administradores pueden ver el historial',
      );
    }
    return this.auditService.findAll(+page, +limit, action, search);
  }
}
