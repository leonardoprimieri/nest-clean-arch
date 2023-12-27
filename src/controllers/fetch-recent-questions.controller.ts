import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { z } from 'zod';
import { JwtAuthGuard } from '~/auth/jwt-auth.guard';
import { ZodValidationPipe } from '~/pipes/zod-validation.pipe';
import { PrismaService } from '~/prisma/prisma.service';

const paginationQuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().positive());

type PaginationQuery = z.infer<typeof paginationQuerySchema>;

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private prismaService: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Query('page', new ZodValidationPipe(paginationQuerySchema))
    page: PaginationQuery,
  ) {
    const PER_PAGE = 10;

    const recentQuestions = await this.prismaService.question.findMany({
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { recentQuestions };
  }
}
