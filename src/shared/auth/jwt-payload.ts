import { UserRole } from 'src/user/models/user-role'

export interface JwtPayload {
    username: string;
    role: UserRole;
    iat?: Date;
}
