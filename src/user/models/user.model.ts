import { BaseModel, schemaOptions } from '../../shared/base.model'
import { prop, ModelType } from 'typegoose'
import { UserRole } from './user-role'

export class User extends BaseModel {
    @prop({
        required: [true, 'Username is required'],
        minlength: [6, 'Must be at least 6 characters'],
        unique: true
    })
    username: string

    @prop({
        required: [true, 'Password is required'],
        minlength: [6, 'Must be at least 6 characters']
    })
    password: string

    @prop({ default: UserRole.User })
    role?: UserRole

    @prop() firstName?: string
    @prop() lastName?: string

    @prop()
    get fullname (): string {
        return `${this.firstName} ${this.lastName}`
    }

    static get model (): ModelType<User> {
        return new User().getModelForClass(User, { schemaOptions })
    }

    static get modelName (): string {
        return this.model.modelName
    }
}
