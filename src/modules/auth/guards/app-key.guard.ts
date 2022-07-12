import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AppKeyGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { headers } = context.switchToHttp().getRequest();
    const key = headers['x-api-key'];
    const app = await this.authService.validateAppKey(key);
    if (!app) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
