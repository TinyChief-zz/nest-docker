import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import { AuthService } from '../../../auth/auth/auth.service'
import { ConfigurationService } from '../../../configuration/configuration.service'
import { Configuration } from '../../../configuration/configuration.enum'
import { JwtPayload } from '../../jwt-payload'

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
    constructor (
        private readonly _authService: AuthService,
        private readonly _configurationService: ConfigurationService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: _configurationService.get(Configuration.JWT_KEY)
        })
    }

    async validate (payload: JwtPayload, done: VerifiedCallback): Promise<any> {
        const user = await this._authService.validatePayload(payload)

        if (!user) {
            return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false)
        }

        return done(null, user, payload.iat)
    }
}
