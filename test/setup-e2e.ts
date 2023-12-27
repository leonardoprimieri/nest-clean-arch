import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

const generateUniqueDatabaseUrl = (schemaId: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
};

const randomSchemaId = randomUUID();

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(randomSchemaId);

  process.env.DATABASE_URL = databaseUrl;

  execSync('pnpm prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${randomSchemaId}" CASCADE`,
  );
  await prisma.$disconnect();
});
