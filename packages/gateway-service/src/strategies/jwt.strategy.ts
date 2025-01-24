import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {JWTService} from '@loopback/authentication-jwt';

export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject('services.JWTService')
    private jwtService: JWTService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractToken(request);
    if (!token) throw new HttpErrors.Unauthorized('Token not found.');

    const userProfile = await this.jwtService.verifyToken(token);
    console.log({userProfile})
    return {
      [securityId]: userProfile.id,
      id: userProfile.id,
      name: userProfile.name,
      roles: userProfile.roles,
    };
  }

  extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    return authHeader.replace('Bearer ', '');
  }
}
