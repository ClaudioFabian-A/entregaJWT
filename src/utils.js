import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const private_key = "Claudio";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, private_key, { expiresIn: "2d" });
  return token;
};

export const authToken = (req, res, next) => {
  const authHeder = req.headers.authorization;
  if (!authHeder) return res.status(401).send({ error: "no autorizado" });
  const token = authHeder;
  jwt.verify(token, private_key, (error, credentials) => {
    if (error) return res.status(403).send({ error: "no autorizado" });
    req.user = credentials.user;
    next();
  });
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export default __dirname;