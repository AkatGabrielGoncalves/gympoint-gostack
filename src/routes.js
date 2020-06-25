import { Router } from 'express';
import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';

import authMiddle from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/students/:studentId/checkins', CheckinController.index);
routes.post('/students/:studentId/checkins', CheckinController.store);

routes.post('/students/:studentId/help-orders', HelpOrderController.store);

routes.use(authMiddle);
routes.put('/students', StudentController.update);
routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);

routes.post('/users', UserController.store);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments/:studentId', EnrollmentController.store);
routes.put('/enrollments/:studentId', EnrollmentController.update);
routes.delete('/enrollments/:studentId', EnrollmentController.delete);

routes.get('/students/:studentId/help-orders', HelpOrderController.show);
routes.get('/students/help-orders', HelpOrderController.index);
routes.put('/help-orders/:helpId/answer', HelpOrderController.update);

export default routes;
