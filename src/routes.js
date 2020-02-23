import { Router } from 'express';

// MIDDLEWARES
import auth from './app/middlewares/auth';

// CONTROLLERS
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

const routes = Router();

routes.post('/sessions', SessionController.store);

routes.post('/recipients', auth, RecipientController.store);
routes.put('/recipients/:id', auth, RecipientController.update);

export default routes;
