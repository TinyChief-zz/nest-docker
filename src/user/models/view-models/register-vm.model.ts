import { LoginVm } from './login-vm.model'
import { ApiModelPropertyOptional } from '@nestjs/swagger'

export class RegisterVm extends LoginVm {
    @ApiModelPropertyOptional() firstname: string
    @ApiModelPropertyOptional() lastname: string
}
