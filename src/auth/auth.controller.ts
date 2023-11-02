// Nest
import { Controller, Get, Post, Body, Req } from '@nestjs/common'

// Service
import { AuthService } from './auth.service'

// DTOs
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data)
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data)
  }

  @Get('validate')
  async validate(@Body() data: any) {
    return this.authService.validate(data)
  }

  @Get('me')
  async getProfile(@Req() request) {
    const token = request.headers.authorization.split(' ')[1]

    return this.authService.getProfile(token)
  }
}
