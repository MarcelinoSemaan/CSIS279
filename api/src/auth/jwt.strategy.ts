import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { officeService } from '../office/office.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private officeService: officeService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    console.log('JwtStrategy initialized with secret:', configService.get<string>('JWT_SECRET'));
  }

  async validate(payload: any) {
    console.log('JWT validate payload:', payload);

    try {
      const office = await this.officeService.findByOfficeID(payload.sub);

      if (!office) {
        console.log('Office not found for ID:', payload.sub);
        throw new UnauthorizedException('Invalid token');
      }

      // Return the user object with camelCase key officeId (to match what the controller expects)
      return {
        officeId: payload.sub,  // Use officeId (camelCase) not officeID (PascalCase)
        officeEmail: payload.email,
        officeBranch: payload.branch
      };
    } catch (error) {
      console.error('Error validating JWT:', error);
      throw new UnauthorizedException('Error processing authentication token');
    }
  }
}
