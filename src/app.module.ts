// Nest
import { Module } from '@nestjs/common';

// Contollers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Modules
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [GameModule, UserModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
