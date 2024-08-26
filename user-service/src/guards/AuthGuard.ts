import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

export class AuthGuard implements CanActivate {
    constructor(
        @Inject('AUTH_CLIENT')
        private readonly client: ClientProxy
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        Logger.log('Auth Guard');
        const req: Request = context.switchToHttp().getRequest();
        const jwt = req.cookies['jwt'];

        if (!jwt) {
            Logger.error('JWT token not found in cookies');
            return false;
        }

        try {
            const res = await firstValueFrom(
                this.client.send(
                    { role: 'auth', cmd: 'check' },
                    { jwt }
                ).pipe(timeout(5000))
            );

            if (res) {
                req.user = res; // Now TypeScript knows about req.user
            }

            return res;
        } catch (err) {
            Logger.error('Error validating JWT:', err);
            return false;
        }
    }
}
