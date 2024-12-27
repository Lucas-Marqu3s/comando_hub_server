import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { User } from '@prisma/client'
import request from 'supertest'

describe('Create user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST /user', async () => {
    const response = await request(app.getHttpServer())
      .post('/user')
      .send(<User>{
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
        document: '12345678901',
        branch: 'Aurora',
        role: 'admin',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: 'john.doe@example.com' },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
