import { Router } from 'express';
import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';

import authMiddle from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', authMiddle, UserController.store);
routes.post('/students', authMiddle, StudentController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddle);
routes.put('/students', StudentController.update);
export default routes;
