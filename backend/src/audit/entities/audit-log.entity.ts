import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  action: string;

  @Column({ length: 50, nullable: true })
  entityType: string;

  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true })
  performedById: string;

  @Column({ length: 100, nullable: true })
  performedByName: string;

  @Column({ length: 20, nullable: true })
  performedByRole: string;

  @Column({ type: 'json', nullable: true })
  details: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
