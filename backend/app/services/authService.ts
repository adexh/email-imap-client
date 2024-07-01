import { User, loginSchema } from 'shared-types';
import { UserRepository } from '../dataAccess/userRepository';
import bcrypt from 'bcryptjs';

export class LoginService {
    constructor(private userRepository: UserRepository) { }

    async login(userData: any): Promise<User | null> {
        const result = loginSchema.safeParse(userData);

        if (!result.success) {
            throw new Error(result.error.message);
        }

        const { email, password } = result.data;

        const userFromDb = await this.userRepository.findByEmail(email);

        if ( userFromDb?.password ) {
            return await bcrypt.compare(password, userFromDb.password) ? userFromDb : null;
        }
        return null;
    }
}