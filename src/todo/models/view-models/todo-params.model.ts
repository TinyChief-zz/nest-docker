import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'
import { EnumToArray } from '../../../shared/utilities/enum-to-array'
import { TodoLevel } from '../todo-enum'

export class TodoParams {
    @ApiModelProperty()
    content: string

    @ApiModelPropertyOptional({ enum: EnumToArray(TodoLevel), example: TodoLevel.Normal })
    level?: TodoLevel
}
