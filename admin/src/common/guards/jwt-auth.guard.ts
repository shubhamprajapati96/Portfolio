import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Authentication token is missing. Please log in.');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid token format. Expected Bearer token.');
    }

    try {
      const secret = process.env.JWT_SECRET || 'shubham_portfolio_secure_jwt_secret_token_2026_xyz';
      const decoded = jwt.verify(token, secret);
      request.user = decoded;
      return true;
    } catch (err: any) {
      throw new UnauthorizedException('Invalid or expired authentication token. Please log in again.');
    }
  }
}
