// Nest
import { Injectable } from '@nestjs/common'

// Passport
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
