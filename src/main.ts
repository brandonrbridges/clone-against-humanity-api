// Nest
import { NestFactory } from '@nestjs/core'

// Modules
import { AppModule } from './app.module'
import { IoAdapter } from '@nestjs/platform-socket.io'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.1.126:3000'],
  })

  app.useWebSocketAdapter(new IoAdapter(app))

  await app.listen(4000, '0.0.0.0')
}
bootstrap()
