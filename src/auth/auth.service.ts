import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { AuthRequestDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signup(authReqDto: AuthRequestDto) {
    const hash = await argon.hash(authReqDto.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authReqDto.email,
          hash,
        },
      });

      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }

      throw error;
    }
  }

  async signin(authReqDto: AuthRequestDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authReqDto.email,
      },
    });

    if (!user) throw new ForbiddenException('User not found');

    const pwMatches = await argon.verify(user.hash, authReqDto.password);

    if (!pwMatches) throw new ForbiddenException('Incorrect password');

    delete user.hash;

    return user;
  }
}
