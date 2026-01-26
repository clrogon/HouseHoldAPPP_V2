import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class HouseholdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      return false;
    }

    // Check if user has a household
    if (!user.householdId) {
      throw new ForbiddenException(
        'You must belong to a household to access this resource',
      );
    }

    // Store householdId on request for easy access in controllers
    request.householdId = user.householdId;

    return true;
  }
}
