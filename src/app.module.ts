// Nest
import { Module } from '@nestjs/common'

// Nest Modules
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

// Modules
import { UserModule } from './user/user.module'
import { GameModule } from './game/game.module'
import { CardModule } from './card/card.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as unknown as number,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      // logging: true,
    }),
    UserModule,
    GameModule,
    CardModule,
  ],
})
export class AppModule {}
