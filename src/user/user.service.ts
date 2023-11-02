// Nest
import { Injectable } from '@nestjs/common'

// TypeORM
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

// Entities
import { User } from './entities/user.entity'

// DTOs
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

// Modules
import * as argon from 'argon2'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(data: CreateUserDto): Promise<User> {
    const hashed = await argon.hash(data.password)

    console.log(hashed)

    const user = await this.userRepo.save({
      ...data,
      password: hashed,
    })

    return user
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepo.find()

    return users
  }

  async findOne(id: string): Promise<User> {
    const user = this.userRepo.findOne({
      where: { id },
    })

    return user
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { username },
    })

    return user
  }

  async findOneByUsernameOrEmail({
    username,
    email,
  }: {
    username: string
    email: string
  }): Promise<User> {
    const user = await this.userRepo.findOne({
      where: [{ username }, { email }],
    })

    return user
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findOne(id)

    if (!user) {
      throw new Error('User not found')
    }

    await this.userRepo.update(id, data)

    return user
  }

  async hashPassword(password: string): Promise<string> {
    const hashed = await argon.hash(password)

    return hashed
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const match = await argon.verify(hashedPassword, password)

    return match
  }
}
