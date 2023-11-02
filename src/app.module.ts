// Nest
import { Module } from '@nestjs/common'

// Nest Modules
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

// Modules
import { AuthModule } from './auth/auth.module'
import { CardModule } from './card/card.module'
import { GameModule } from './game/game.module'
import { UserModule } from './user/user.module'

const HOST =
  process.env.NODE_ENV === 'production'
    ? 'clone-against-humanity-db'
    : 'localhost'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: HOST,
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'clone-against-humanity',
      autoLoadEntities: true,
      synchronize: true,
      // logging: true,
    }),
    AuthModule,
    CardModule,
    GameModule,
    UserModule,
  ],
})
export class AppModule {}
