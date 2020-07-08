import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

// MIDDLEWARES
import auth from './app/middlewares/auth';
import findDeliveryman from './app/middlewares/find-deliveryman';

// VALIDATORS
import SessionValidator from './app/validators/SessionValidator';
import RecipientValidator from './app/validators/RecipientValidator';
import OrderValidator from './app/validators/OrderValidator';
import DeliveryProblemValidator from './app/validators/DeliveryProblemValidator';
import DeliverymanValidator from './app/validators/DeliverymanValidator';

// CONTROLLERS
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveriesController from './app/controllers/DeliveriesController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import ProblemController from './app/controllers/ProblemController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionValidator.store, SessionController.store);

routes.get('/deliveryman/:id/deliveries', DeliveriesController.index);
routes.put(
  '/deliveryman/:id/deliveries/:order_id',
  upload.single('file'),
  DeliveriesController.update
);

routes.get('/delivery/:order_id/problems', DeliveryProblemController.index);
routes.post(
  '/delivery/:order_id/problems',
  DeliveryProblemValidator.store,
  DeliveryProblemController.store
);

routes.get('/delivery/problem', ProblemController.index);
routes.delete(
  '/delivery/problem/:problem_id/cancel-delivery',
  ProblemController.delete
);

routes.use(auth);

routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.post('/recipients', RecipientValidator.store, RecipientController.store);
routes.put(
  '/recipients/:id',
  RecipientValidator.update,
  RecipientController.update
);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.get('/deliveryman', DeliverymanController.index);
routes.get('/deliveryman/:id', findDeliveryman, DeliverymanController.show);
routes.post(
  '/deliveryman',
  DeliverymanValidator.store,
  DeliverymanController.store
);
routes.put(
  '/deliveryman/:id',
  findDeliveryman,
  DeliverymanValidator.update,
  DeliverymanController.update
);
routes.delete(
  '/deliveryman/:id',
  findDeliveryman,
  DeliverymanController.delete
);

routes.get('/orders', OrderController.index);
routes.get('/orders/:id', OrderController.show);
routes.post('/orders', OrderValidator.store, OrderController.store);
routes.put('/orders/:id', OrderValidator.update, OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
