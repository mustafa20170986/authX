import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role, role_keys } from './role.decorator';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RoleGuard implements CanActivate {
  //relfector is custom utiltiy that helps to read metadata
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requireRole = this.reflector.getAllAndOverride<string[]>(role_keys, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requireRole.some((role) => user?.role?.includes(role));
  }
}
