import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
// import './Modules/jwt'
import { AuthenticateUserDto } from './Dtos/authenticateUserDto';
import { AuthenticateTokenResponseDto } from './Dtos/authenticateTokenResponseDto';
import * as Settings from './settings.json';
import { instantiateJwt } from './Modules/jwt';

@Controller()
export class AppController {
  jwtMod: JwtService;
  constructor() {
    this.jwtMod = instantiateJwt(Settings.Jwt)
  }

  @Post("authenticate")
  async postAuthenticate(@Body() body : AuthenticateUserDto): Promise<AuthenticateTokenResponseDto> {
    // Basic gateway checkup, to not build up pressure
    if (body.Password.length < parseInt(Settings.Authentication.Password.Min_Length) || body.Username.length < parseInt(Settings.Authentication.Username.Min_Length)){
      return;
    }
    const req = await fetch(Settings.Backend.Service_Names.Database.IP);
    const data = await req.json();
    return data;
  }

  @Get("userdata")
  
  async getUserData(@Headers("Authorization") authorizationToken : string) {

  }
}
