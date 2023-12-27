import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { UserToken } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() { sub }: UserToken,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    { title, content }: CreateQuestionBody,
  ) {
    const userId = sub;

    const alreadyCreatedQuestion = await this.prismaService.question.findUnique(
      {
        where: {
          slug: this.convertToSlug(title),
        },
      },
    );

    if (alreadyCreatedQuestion) {
      throw new ConflictException('Question already created');
    }

    const createdQuestion = await this.prismaService.question.create({
      data: {
        content,
        title,
        slug: this.convertToSlug(title),
        authorId: userId,
      },
    });

    return createdQuestion;
  }

  private convertToSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };
}
