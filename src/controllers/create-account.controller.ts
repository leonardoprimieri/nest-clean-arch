import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { PasswordEncryptionService } from '~//infra/password-hash/password-hash';
import { ZodValidationPipe } from '~//pipes/zod-validation.pipe';
import { PrismaService } from '~//prisma/prisma.service';
import { z } from 'zod';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBody = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(
    private prismaService: PrismaService,
    private passwordEncryptionService: PasswordEncryptionService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() { email, name, password }: CreateAccountBody) {
    const alreadyRegisteredUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (alreadyRegisteredUser) {
      throw new ConflictException('E-mail already registered');
    }

    const hashedPassword = await this.passwordEncryptionService.hash(password);

    const createdAccount = await this.prismaService.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return {
      id: createdAccount.id,
      email: createdAccount.email,
      name: createdAccount.name,
    };
  }
}
