import { Injectable, Inject, Logger, RequestTimeoutException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

// import { UserInterface } from '../../../user-service/src/user/user.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject('USER_CLIENT')
        private readonly client: ClientProxy,
        private readonly jwtService: JwtService) { }

    async validateUser(username: string, password: string): Promise<any> {
        try {
            console.log('validateUser')
            const user = await this.client.send({ role: 'user', cmd: 'get' }, { username })
                .pipe(
                    timeout(5000),
                    catchError(err => {
                        if (err instanceof TimeoutError) {
                            return throwError(new RequestTimeoutException());
                        }
                        return throwError(err);
                    }),)
                .toPromise();

            if (bcrypt.compareSync(password, user?.password)) {
                return user;
            }

            return null;
        } catch (e) {
            Logger.log(e);
            return new Error('Something went wrong');
            throw e;
        }
    }

    async register(createUserDto: CreateUserDto) { }

    // async login(user) {
    //     const payload = { user, sub: user.id };
    //     console.log(user)

    //     return {
    //         userId: user.id,
    //         accessToken: this.jwtService.sign(payload)
    //     };
    // }

    async login(user, res: Response) {
        const payload = { user, sub: user.id };
        const token = this.jwtService.sign(payload);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            // sameSite: 'strict',
        });

        return {
            userId: user.id,
            accessToken: token,
        };
    }

    async logout(res: Response) {
        res.clearCookie('jwt');
    }

    validateToken(jwt: string) {
        return this.jwtService.verify(jwt);
    }
}