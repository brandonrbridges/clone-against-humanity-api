// Nest
import { NestFactory } from '@nestjs/core'

// Modules
import { AppModule } from './app.module'
import { readFileSync } from 'fs'
import { IoAdapter } from '@nestjs/platform-socket.io'

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(
      '/etc/letsencrypt/live/api.cloneagainsthumanity.com/privkey.pem',
    ),
    cert: readFileSync(
      '/etc/letsencrypt/live/api.cloneagainsthumanity.com/fullchain.pem',
    ),
  }

  const app = await NestFactory.create(AppModule, { httpsOptions })

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.1.126:3000',
      'https://cloneagainsthumanity.com',
    ],
  })

  app.useWebSocketAdapter(new IoAdapter(app))

  await app.listen(4000, '0.0.0.0')
}
bootstrap()
