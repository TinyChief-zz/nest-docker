import {
    Controller, Post, HttpStatus, Body, HttpException, Get, Put, Delete, Param
} from '@nestjs/common'
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { Todo } from './models/todo-model'
import { TodoService } from './todo/todo.service'
import { TodoParams } from './models/view-models/todo-params.model'
import { TodoVm } from './models/view-models/todo-vm.model'
import { ApiExcetion } from '../shared/api-exception.model'
import { GetOperationId } from '../shared/utilities/get-operation-id'

@Controller('todos')
@ApiUseTags(Todo.modelName)
export class TodoController {
    constructor (private readonly _todoService: TodoService) {}

    @Post()
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
    @ApiResponse({ status: HttpStatus.OK, type: TodoVm, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiExcetion })
    @ApiOperation(GetOperationId(Todo.modelName, 'GetAll'))
    async get (): Promise<TodoVm[]> {
        try {
            const todos = await this._todoService.findAll()
            return this._todoService.map<TodoVm[]>(todos.map(todo => todo.toJSON()), true)
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Put()
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

        if (exists.isComplited) {
            throw new HttpException(`${id} already completed`, HttpStatus.BAD_REQUEST)
        }

        exists.content = content
        exists.level = level
        exists.isComplited = isCompleted

        try {
            const updated = await this._todoService.update(id, exists)
            return this._todoService.map<TodoVm>(updated.toJSON())
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete(':id')
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
