// process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
// import './Modules/jwt'
import { AuthenticateUserDto } from './Dtos/authenticateUserDto';
import { AuthenticateTokenResponseDto } from './Dtos/authenticateTokenResponseDto';
import * as Settings from './settings.json';
// import { instantiateJwt } from './Modules/jwt';
import * as jose from 'jose'
import axios from 'axios'
import { Agent } from 'https';

@Controller()
export class AppController {
  joseJwt: string
  axiosConfig
  constructor() {

    var enc = new TextEncoder()
    new jose.SignJWT({ 'unique_name': "gateway" })
      .setProtectedHeader(
        {
          alg: "HS256",
          typ: "JWT"
        }
      )
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(enc.encode(Settings.Jwt.Key))
      .then((val) => {
        this.joseJwt = val
      })
    this.axiosConfig = {
      headers: {
        'Authorization': "Bearer " + this.joseJwt
      },
      httpsAgent: new Agent({
        rejectUnauthorized: false
      })
    }
  }

  @Post("authenticate")
  async postAuthenticate(@Body() body: AuthenticateUserDto): Promise<any> {
    // Basic gateway checkup, to not build up pressure
    // if (body.Password.length < parseInt(Settings.Authentication.Password.Min_Length) || body.Username.length < parseInt(Settings.Authentication.Username.Min_Length)){
    //   return;
    // }
    const url = Settings.Backend.Service_Names.Database.IP + "/user/Authenticate"
    let postConfig = this.axiosConfig
    console.log(body)

    let result = await axios.post(url, body, {
      headers: {
        Authorization: this.joseJwt
      }
    })
    return await result.data



  }

  @Get("userdata")

  async getUserData() {
    console.log(this.joseJwt)
    const url = Settings.Backend.Service_Names.Database.IP + "/user"
    await axios.get(url, this.axiosConfig).then((resp) => {
      console.log(resp)
    })
    return 'nice'
  }
}
