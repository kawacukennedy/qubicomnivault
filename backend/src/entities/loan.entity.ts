import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { oqAsset } from './oqAsset.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  oqAsset_id: string;

  @ManyToOne(() => oqAsset)
  @JoinColumn({ name: 'oqAsset_id' })
  oqAsset: oqAsset;

  @Column('float')
  principal_usd: number;

  @Column('float')
  interest_rate_annual: number;

  @Column({ type: 'enum', enum: ['active', 'repaid', 'liquidated'], default: 'active' })
  status: string;

  @Column('float')
  ltv: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}