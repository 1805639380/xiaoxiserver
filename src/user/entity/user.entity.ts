import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 25 })
  account: string;

  @Column({ type: 'varchar', length: 25 })
  password: string;

  @Column({ type: 'varchar', length: 25 })
  email: string;

  @CreateDateColumn()
  sign_time: string;

  @Column({ type: 'varchar', length: 25 })
  salt: string;

  @Column({ type: 'int', default: 0 })
  role: number;
}
