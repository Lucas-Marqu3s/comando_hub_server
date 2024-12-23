import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { CreateUsersController } from './controllers/create_users'
import { envSchema } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [CreateUsersController],
  providers: [PrismaService],
})
export class AppModule {}
