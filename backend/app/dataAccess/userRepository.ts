import { db } from '../../infrastructure/db';
import { users } from '../../infrastructure/schema';
import { eq } from 'drizzle-orm';
import { User, UserParams } from 'shared-types'

export class UserRepository {
  public async updateUserToken(email: string, linkedMail:string, token: string): Promise<void> {
    await db.update(users).set({ token: token, linkedMail: linkedMail  }).where(eq(users.email, email));
  }

  public async findByEmail(email: string): Promise<User | null> {
    const [userFromDb] = await db.select({ id:users.id, email:users.email, password:users.password, name:users.name}).from(users).where(eq(users.email, email));
    return userFromDb ? {id:userFromDb.id, email: userFromDb.email, name: userFromDb.name, password: userFromDb.password} : null;
  }

  async save(user: UserParams): Promise<void> {
    await db.insert(users).values({
      name: user.name,
      email: user.email,
      password: user.password
    })
  }

  public async getAccessToken(email: string): Promise<string | null> {
    const [result] = await db.select({token: users.token}).from(users).where(eq(users.email, email));

    return result.token;
  }
}