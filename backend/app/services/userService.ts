import type { UserRepository } from '../dataAccess/userRepository';
import { UserParams, userSchema } from 'shared-types';
import bcrypt from 'bcryptjs';

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async register(userData: any): Promise<string> {
        const result = userSchema.safeParse(userData);
        if (!result.success) {
            throw new Error(JSON.stringify(result.error.errors));
        }

        const { name, email, password } = result.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) {
            throw new Error('Email already in use');
        }

        const user: UserParams = {
            name: name,
            email: email,
            password: hashedPassword
        };

        await this.userRepository.save(user);
        return 'User created';
    }

    async getUserInfo(user: any) {
        if (!user) {
            throw new Error('Unauthorized');
        }
        return user;
    }
    
    async accessToken(email: string): Promise<string> {
        const token = await this.userRepository.getAccessToken(email);
        if( token )
            return token;
        else {
            console.log("token : ", token);
            throw new Error('Issue in getting access token');
        }
    }

}