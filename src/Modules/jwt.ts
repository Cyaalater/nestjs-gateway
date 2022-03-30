import * as jose from 'jose'


interface JwtConfig {
    Key: string
  }
  
  
interface IJwtService {
    sign() : Promise<string>
}

interface JwtServiceFactory {
    new (jwtJsonConfig: JwtConfig) : IJwtService
}

class JwtService implements IJwtService {
  key: string;
  constructor(jwtJsonConfig: JwtConfig){
    this.key = jwtJsonConfig.Key
  }

  async sign(){
    var enc = new TextEncoder()
    return await new jose.SignJWT({'sub' : "gateway"})
    .setProtectedHeader({alg : "HS256"}) 
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(enc.encode(this.key))
  }
}

export function instantiateJwt(jwtConfig: JwtConfig){
    return new JwtService(jwtConfig)
}