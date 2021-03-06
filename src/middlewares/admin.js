import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env, variables } from '../utils/env.js';
import { generateErrorObject } from '../utils/error.js';

async function admin(req, res, next) {
  try {
    const headerAuthorization = req.header('Authorization');
    if (!headerAuthorization) {
      return res.status(403).send(generateErrorObject('accessDenied'));
    }

    const token = headerAuthorization.split(' ')[1];

    const decoded = jwt.verify(token, env(variables.accessTokenSecret));
    if (!decoded) {
      return res.status(403).send(generateErrorObject('invalidAuth'));
    }

    const user = await User.findOne({ _id: decoded._id }).select('-password').lean();
    if (!user) {
      return res.status(404).send(generateErrorObject('userNotFound'));
    }

    if (user.role !== 'admin') {
      return res.status(403).send(generateErrorObject('accessDenied'));
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).send(generateErrorObject('invalidToken'));
  }
}

export default admin;
