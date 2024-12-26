import { Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current_user_decorator'
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard'
import { UserPayload } from 'src/auth/jwt_strategy'

@Controller('/dashboard')
@UseGuards(JwtAuthGuard)
export class CreateDashboardController {
  constructor() {}

  @Post()
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user.sub)

    return 'OK'
  }
}
