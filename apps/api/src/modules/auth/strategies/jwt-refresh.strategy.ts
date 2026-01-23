import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../../database/prisma.service';

interface JwtPayloadWithRefresh {
  sub: string;
  email: string;
  refreshToken?: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret') || 'fallback-refresh-secret-change-in-production',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtPayloadWithRefresh,
  ): Promise<JwtPayloadWithRefresh> {
    const refreshToken = req.body?.refreshToken;

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      sub: user.id,
      email: user.email,
      refreshToken,
    };
  }
}
