// Nest
import { Module } from '@nestjs/common'

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm'

// Service
import { UserService } from './user.service'

// Controller
import { UserController } from './user.controller'

// Entities
import { User } from './entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
