import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail, Min } from 'class-validator';
import { UserInterface } from '../user.interface';

import { Exclude } from 'class-transformer';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User implements UserInterface {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    @Min(8)
    @Exclude({ toPlainOnly: true })  // Exclude password from serialization
    password: string;

    @Column()
    name: string;

    @Column()
    @IsEmail()
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    // @BeforeInsert()
    // async hashPassword() {
    //     this.password = await bcrypt.hash(this.password, 10);
    // }
}