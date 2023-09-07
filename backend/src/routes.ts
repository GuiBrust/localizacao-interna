import { Router } from 'express';

import { CreateUserController } from './controllers/user/CreateUserController';
import { DeleteUserController } from './controllers/user/DeleteUserController';
import { UpdateUserController } from './controllers/user/UpdateUserController';
import { ListUsersController } from './controllers/user/ListUsersController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';

import { isAuthenticated } from './middlewares/IsAuthenticated';

const router = Router();

router.post('/users', new CreateUserController().handle);
router.delete('/users', new DeleteUserController().handle);
router.put('/users', new UpdateUserController().handle);
router.get('/users', new ListUsersController().handle);
router.get('/me', isAuthenticated, new DetailUserController().handle);

router.post('/session', new AuthUserController().handle);

export { router };