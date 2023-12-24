import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

@Injectable()
export class PasswordEncryptionService {
  async hash(plaintext: string) {
    return hash(plaintext, 8);
  }
}
