import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { CreateUserController } from './controllers/create_user'
import { AuthenticateController } from './controllers/authenticate'
import { CreateDashboardController } from './controllers/create_dashboard'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateUserController,
    AuthenticateController,
    CreateDashboardController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
