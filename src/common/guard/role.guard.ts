import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Profile } from 'src/user/entity/profile.entity';
import { UserService } from 'src/user/user.service';
import { metadata } from '../constant';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const role =
      this.reflector.get<number>(metadata.ROLE, context.getHandler()) ||
      this.reflector.get<number>(metadata.ROLE, context.getClass());

    if (role === undefined) {
      return false;
    }
    let token = request.headers['authorization'];
    // 游客权限为0, 不需要登录
    if (role === 0 && !token) {
      return true;
    }
    if (token) {
      token = token.split(' ')[1];
    }
    const userProfile =
      (request.user as Profile) || (this.jwtService.verify(token) as Profile);

    // 未登录，游客，放行
    if (!userProfile) return true;

    return this.userService.matchRole(role, userProfile.uid);
  }
}
