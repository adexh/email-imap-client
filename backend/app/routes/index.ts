import { Application } from 'express';

import userRouter from './userRoutes';
import mailRouter from './emailRoutes';

export function Routers(app: Application): void {

    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/mail', mailRouter);
}