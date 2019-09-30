import { ApiModelPropertyOptional } from '@nestjs/swagger'

export class ApiExcetion {
    @ApiModelPropertyOptional() statusCode?: number
    @ApiModelPropertyOptional() message?: string
    @ApiModelPropertyOptional() status?: string
    @ApiModelPropertyOptional() error?: string
    @ApiModelPropertyOptional() errors?: any
    @ApiModelPropertyOptional() timestamp?: string
    @ApiModelPropertyOptional() path?: string
}
