import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ValuationJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  document_id: string;

  @Column('float')
  suggested_value: number;

  @Column('float')
  confidence: number;

  @Column('jsonb')
  oracle_sources: any;

  @Column({ type: 'enum', enum: ['pending', 'done', 'manual_review'], default: 'pending' })
  status: string;
}