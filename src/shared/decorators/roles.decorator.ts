import { UserRole } from '../../user/models/user-role'
import { SetMetadata } from '@nestjs/common'

export const Roles = (...roles: UserRole[]): any => SetMetadata('roles', roles)
