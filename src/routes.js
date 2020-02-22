import { Router } from 'express';

import User from './app/models/User';

const routes = Router();

routes.get('/users', async (req, res) => {
  return res.json({ users: await User.findAll() });
});

export default routes;
