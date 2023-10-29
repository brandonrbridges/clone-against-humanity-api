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
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'clone-against-humanity',
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
