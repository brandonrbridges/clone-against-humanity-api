// Nest
import { Module } from '@nestjs/common'

// Nest Modules
import { JwtModule } from '@nestjs/jwt'

// Service
import { AuthService } from './auth.service'

// Controller
import { AuthController } from './auth.controller'

// Modules
import { UserModule } from 'src/user/user.module'

// Strategy
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret:
        '3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d3f4g5h6j7k8l9k8j7h6g5f4d3s2a1s2d',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
