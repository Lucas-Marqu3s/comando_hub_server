import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Dashboard } from '@prisma/client'
import request from 'supertest'

describe('Create dashboard (E2E)', () => {
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

  test('[POST /dashboard', async () => {
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

    const response = await request(app.getHttpServer())
      .post('/dashboard')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(<Dashboard>{
        title: 'Dash test',
        link: 'http://testdash.com',
      })

    expect(response.statusCode).toBe(201)

    const dashboardOnDatabase = await prisma.dashboard.findFirst({
      where: { title: 'Dash test' },
    })

    expect(dashboardOnDatabase).toBeTruthy()
  })
})
