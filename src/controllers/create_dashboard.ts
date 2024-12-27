import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current_user_decorator'
import { JwtAuthGuard } from '@/auth/jwt_auth.guard'
import { UserPayload } from '@/auth/jwt_strategy'
import { ZodValidationPipe } from '@/pipes/zod_validation_pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createDashboardBodySchema = z.object({
  title: z.string(),
  link: z.string().url(),
})

type CreateDashboardBodySchema = z.infer<typeof createDashboardBodySchema>

@Controller('/dashboard')
@UseGuards(JwtAuthGuard)
export class CreateDashboardController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createDashboardBodySchema))
    body: CreateDashboardBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, link } = body
    const userId = user.sub

    await this.prisma.dashboard.create({
      data: {
        title,
        link,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    })

    return 'Dashboard created successfully.'
  }
}
