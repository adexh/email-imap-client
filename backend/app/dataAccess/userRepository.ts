import { db } from '../../infrastructure/db';
import { users } from '../../infrastructure/schema';
import { eq } from 'drizzle-orm';
import { User, UserParams } from 'shared-types'

export class UserRepository {
  public async updateUserToken(userName: string, token: string): Promise<void> {
    await db.update(users).set({ token: token }).where(eq(users.name, userName));
  }

  public async findByEmail(email: string): Promise<User | null> {
    const [userFromDb] = await db.select({ email:users.email, password:users.password, name:users.name}).from(users).where(eq(users.email, email));
    return userFromDb ? {email: userFromDb.email, name: userFromDb.name} : null;
  }

  async save(user: UserParams): Promise<void> {
    await db.insert(users).values({
      name: user.name,
      email: user.email,
      password: user.password
    })
  }
}