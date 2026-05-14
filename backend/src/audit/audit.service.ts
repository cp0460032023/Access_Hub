import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

export interface AuditActor {
  id: string;
  name: string;
  role: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(
    action: string,
    entityType: string,
    entityId: string | null,
    actor: AuditActor | null,
    details?: Record<string, any>,
  ): Promise<void> {
    const entry = this.auditRepository.create({
      action,
      entityType,
      entityId: entityId ?? undefined,
      performedById: actor?.id,
      performedByName: actor?.name,
      performedByRole: actor?.role,
      details,
    });
    await this.auditRepository.save(entry);
  }

  async findAll(page: number, limit: number, action?: string, search?: string) {
    const query = this.auditRepository
      .createQueryBuilder('log')
      .orderBy('log.createdAt', 'DESC');

    if (action) {
      query.andWhere('log.action = :action', { action });
    }

    if (search) {
      query.andWhere('log.performedByName ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const total = await query.getCount();
    const data = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total, page, limit };
  }
}
