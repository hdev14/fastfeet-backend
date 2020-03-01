import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

// MIDDLEWARES
import auth from './app/middlewares/auth';

// CONTROLLERS
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.get('/deliverers', DeliverymanController.index);
routes.post('/deliverers', DeliverymanController.store);
routes.put('/deliverers/:id', DeliverymanController.update);
routes.delete('/deliverers/:id', DeliverymanController.delete);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
