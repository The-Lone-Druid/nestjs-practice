import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthRequestDto } from 'src/dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() authReqDto: AuthRequestDto) {
    return this.authService.signup(authReqDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() authReqDto: AuthRequestDto) {
    return this.authService.signin(authReqDto);
  }
}
