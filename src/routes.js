import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

// MIDDLEWARES
import auth from './app/middlewares/auth';

// CONTROLLERS
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
