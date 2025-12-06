import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Document } from './document.entity';

@Entity()
export class oqAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  document_id: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column()
  token_id: string;

  @Column('float')
  face_value_usd: number;

  @Column({ nullable: true })
  mint_tx_hash: string;

  @Column()
  owner_address: string;

  @CreateDateColumn()
  created_at: Date;
}