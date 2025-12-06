import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  wallet_address: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'float', default: 50 })
  q_score: number;

  @Column({ type: 'enum', enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' })
  kyc_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}