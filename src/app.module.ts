import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { PasswordEncryptionService } from './infra/password-hash/password-hash';

@Module({
  controllers: [CreateAccountController],
  providers: [PrismaService, PasswordEncryptionService],
})
export class AppModule {}
