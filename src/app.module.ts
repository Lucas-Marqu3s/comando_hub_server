import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateUsersController } from './controllers/create_users'

@Module({
  controllers: [CreateUsersController],
  providers: [PrismaService],
})
export class AppModule {}
