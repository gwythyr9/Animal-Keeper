import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from './User';

@Entity()
export default class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'smallint' })
  age: number;

  @Column({ type: 'smallint' })
  type: number;

  @ManyToOne(() => User, (user) => user.pet)
  user: User;
}
