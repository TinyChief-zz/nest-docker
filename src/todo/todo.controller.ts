import {
    Controller, Post, HttpStatus, Body, HttpException, Get, Put, Delete, Param, Query, UseGuards
} from '@nestjs/common'
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitQuery, ApiBearerAuth } from '@nestjs/swagger'
import { Todo } from './models/todo-model'
import { TodoService } from './todo/todo.service'
import { TodoParams } from './models/view-models/todo-params.model'
import { TodoVm } from './models/view-models/todo-vm.model'
import { ApiExcetion } from '../shared/api-exception.model'
import { GetOperationId } from '../shared/utilities/get-operation-id'
import { TodoLevel } from './models/todo-enum'
import { ToBooleanPipe } from '../shared/pipes/toBoolean.pipe'
import { Roles } from '../shared/decorators/roles.decorator'
import { UserRole } from '../user/models/user-role'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../shared/guards/roles.guard'

@Controller('todos')
@ApiUseTags(Todo.modelName)
@ApiBearerAuth()
export class TodoController {
    constructor (private readonly _todoService: TodoService) {}

    @Post()
    @Roles(UserRole.Admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiResponse({ status: HttpStatus.CREATED, type: TodoVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiExcetion })
    @ApiOperation(GetOperationId(Todo.modelName, 'Create'))
    async create (@Body() params: TodoParams): Promise<TodoVm> {
        const { content } = params

        if (!content) {
            throw new HttpException('Content is require', HttpStatus.BAD_REQUEST)
        }

        try {
            const newTodo = await this._todoService.createTodo(params)
            return this._todoService.map<TodoVm>(newTodo)
        } catch (e) {
            throw new HttpException('Could not create new todo', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get()
    @Roles(UserRole.Admin, UserRole.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiResponse({ status: HttpStatus.OK, type: TodoVm, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiExcetion })
    @ApiOperation(GetOperationId(Todo.modelName, 'GetAll'))
    @ApiImplicitQuery({ name: 'level', required: false, isArray: true, collectionFormat: 'multi' })
    @ApiImplicitQuery({ name: 'isCompleted', required: false })
    async get (
        @Query('level') level?: TodoLevel,
        @Query('isCompleted', new ToBooleanPipe()) isCompleted?: boolean
    ): Promise<TodoVm[]> {
        try {
            let filter: any = {}

            if (level) {
                filter.level = { $in: Array.isArray(level) ? [...level] : [level] }
            }

            if (isCompleted !== null) {
                if (filter.level) {
                    filter = { $and: [{ level: filter.level }, { isCompleted }] }
                } else {
                    filter.isCompleted = isCompleted
                }
            }

            const todos = await this._todoService.findAll(filter)
            return this._todoService.map<TodoVm[]>(todos.map(todo => todo.toJSON()), true)
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Put()
    @Roles(UserRole.Admin, UserRole.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiResponse({ status: HttpStatus.CREATED, type: TodoVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiExcetion })
    @ApiOperation(GetOperationId(Todo.modelName, 'Update'))
    async update (@Body() vm: TodoVm): Promise<TodoVm> {
        const { id, content, level, isCompleted } = vm

        if (!vm || !id) {
            throw new HttpException('Missing parametrs', HttpStatus.BAD_REQUEST)
        }

        const exists = await this._todoService.findById(id)
        if (!exists) {
            throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND)
        }

        if (exists.isCompleted) {
            throw new HttpException(`${id} already completed`, HttpStatus.BAD_REQUEST)
        }

        exists.content = content
        exists.level = level
        exists.isCompleted = isCompleted

        try {
            const updated = await this._todoService.update(id, exists)
            return this._todoService.map<TodoVm>(updated.toJSON())
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete(':id')
    @Roles(UserRole.Admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiResponse({ status: HttpStatus.OK, type: TodoVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiExcetion })
    @ApiOperation(GetOperationId(Todo.modelName, 'Delete'))
    async delete (@Param('id') id: string): Promise<TodoVm> {
        if (!id) {
            throw new HttpException('id param is required', HttpStatus.BAD_REQUEST)
        }
        try {
            const deleted = await this._todoService.delete(id)
            return this._todoService.map<TodoVm>(deleted.toJSON())
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
