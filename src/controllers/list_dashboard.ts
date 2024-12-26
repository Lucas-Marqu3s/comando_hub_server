import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod_validation_pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queyValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/dashboard')
@UseGuards(JwtAuthGuard)
export class ListDashboardController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queyValidationPipe) page: PageQueryParamSchema) {
    const perPage = 10
    const dashboards = await this.prisma.dashboard.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { dashboards }
  }
}
