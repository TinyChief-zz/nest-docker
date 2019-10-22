import { PipeTransform, ArgumentMetadata } from '@nestjs/common'

export class ToBooleanPipe implements PipeTransform {
    transform (value: any, { type, metatype }: ArgumentMetadata): boolean | null {
        if (type === 'query' && metatype === Boolean) {
            return value ? value === 'true' : null
        }

        return value
    }
}
