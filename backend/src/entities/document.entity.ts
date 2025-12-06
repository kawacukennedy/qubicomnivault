import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  object_store_key: string;

  @Column()
  hash: string;

  @Column({ type: 'enum', enum: ['uploaded', 'valued', 'minted'], default: 'uploaded' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}