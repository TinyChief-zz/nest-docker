import { BaseModelVm } from '../../../shared/base.model'
import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger'
import { EnumToArray } from '../../../shared/utilities/enum-to-array'
import { UserRole } from '../user-role'

export class UserVm extends BaseModelVm {
    @ApiModelProperty() username: string
    @ApiModelPropertyOptional() firstname?: string
    @ApiModelPropertyOptional() lastname?: string
    @ApiModelPropertyOptional() fullname?: string
    @ApiModelPropertyOptional({ enum: EnumToArray(UserRole) }) role?: string
}
