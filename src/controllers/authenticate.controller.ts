import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordEncryptionService } from '~//infra/password-hash/password-hash';
import { ZodValidationPipe } from '~//pipes/zod-validation.pipe';
import { PrismaService } from '~//prisma/prisma.service';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBody = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private passwordEncryptionService: PasswordEncryptionService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() { email, password }: AuthenticateBody) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordEncryptionService.compare(
      password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      sub: foundUser.id,
    });

    return {
      access_token: accessToken,
    };
  }
}
