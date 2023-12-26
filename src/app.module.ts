import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { PasswordEncryptionService } from './infra/password-hash/password-hash';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: envSchema.parse,
      isGlobal: true,
    }),
  ],
  controllers: [CreateAccountController],
  providers: [PrismaService, PasswordEncryptionService],
})
export class AppModule {}
