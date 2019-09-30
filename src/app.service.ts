import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
    greet (): string {
        return 'You probably want to visit /api/docs'
    }
}
