import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import Pet from './Pet';

@Entity()
@Unique(['phone'])
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 30)
  @IsNotEmpty()
  name: string;

  @Column({ type: 'date' })
  @IsNotEmpty()
  birthday: string;

  @Column()
  @IsNotEmpty()
  phone: string;

  @Column()
  @Length(4, 100)
  @IsNotEmpty()
  password: string;

  @Column({ type: 'smallint' })
  @IsNotEmpty()
  gender: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Pet, (pet) => pet.user, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  pet: Pet[];

  hashPassword(): void {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
