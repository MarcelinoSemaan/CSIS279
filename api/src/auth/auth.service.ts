import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { officeService } from '../office/office.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private officeService: officeService,
    private jwtService: JwtService,
  ) {}

  async validateOffice(officeEmail: string, password: string): Promise<any> {
    const office = await this.officeService.findByEmail(officeEmail);

    if (!office) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, office.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return office;
  }

  async login(officeEmail: string, password: string) {
    const office = await this.validateOffice(officeEmail, password);

    const payload = {
      email: office.officeEmail,
      sub: office.officeID,
      branch: office.officeBranch
    };

    return {
      access_token: this.jwtService.sign(payload),
      officeId: office.officeID,
      officeBranch: office.officeBranch,
      officeEmail: office.officeEmail
    };
  }
}
