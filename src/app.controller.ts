import { Controller, Get } from '@nestjs/common'
/* eslint-disable-next-line */
import { AppService } from './app.service'

@Controller('/root')
export class AppController {
    constructor (private readonly AppService: AppService) {}
    @Get()
    sayHello (): string {
        return this.AppService.greet()
    }
}
