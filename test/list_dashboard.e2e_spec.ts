import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('List dashboard (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET /dashboard', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
        document: '12345678901',
        branch: 'Aurora',
        role: 'admin',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.dashboard.createMany({
      data: [
        {
          title: 'Dash test',
          link: 'http://testdash.com',
          userId: user.id,
        },
        {
          title: 'Dash test 2',
          link: 'http://testdash2.com',
          userId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/dashboard')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      dashboards: [
        expect.objectContaining({ title: 'Dash test' }),
        expect.objectContaining({ title: 'Dash test 2' }),
      ],
    })
  })
})
