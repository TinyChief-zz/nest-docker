import { BaseModel, schemaOptions } from '../../shared/base.model'
import { prop, ModelType } from 'typegoose'
import { TodoLevel } from './todo-enum'

export class Todo extends BaseModel<Todo> {
    @prop({ required: [true, 'Content is required'] })
    content: string

    @prop({ enum: TodoLevel, default: TodoLevel.Normal })
    level: string

    @prop({ default: false })
    isComplited: boolean

    static get model (): ModelType<Todo> {
        return new Todo().getModelForClass(Todo, { schemaOptions })
    }

    static get modelName (): string {
        return this.model.modelName
    }
}
