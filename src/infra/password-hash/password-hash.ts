import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class PasswordEncryptionService {
  async hash(plaintext: string) {
    return hash(plaintext, 8);
  }

  async compare(plaintext: string, digest: string) {
    return compare(plaintext, digest);
  }
}
