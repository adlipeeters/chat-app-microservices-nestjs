import { Controller, Post, UseGuards, Request, Logger, Body, Response } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService) { }

    // @UseGuards(LocalAuthGuard)
    // @Post('login')
    // async login(@Request() req) {
    //     return this.authService.login(req.user);
    // }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Response() res) {
        const result = await this.authService.login(req.user, res);
        return res.send(result);
    }

    @Post('logout')
    async logout(@Response() res) {
        const result = await this.authService.logout(res);
        return res.send(result);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @MessagePattern({ role: 'auth', cmd: 'check' })
    async loggedIn(data) {
        try {
            const res = this.authService.validateToken(data.jwt);

            return res;
        } catch (e) {
            Logger.log(e);
            return false;
        }
    }
}