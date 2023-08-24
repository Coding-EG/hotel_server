import "dotenv/config";
import jwt from "jsonwebtoken";
import { __dirname } from "../index.js";
const private_key = process.env.PRIVATE_KEY;

export function authorizeToken(req, res, next) {
  // console.log(req.cookies);
  const token = req.cookies.token;
  if (!token) {
    return res.sendFile(__dirname + "/public/login.html");
  }
  jwt.verify(token, private_key, (error, user) => {
    if (error) {
      // console.log(error);
      res.clearCookie("token");
      return res.sendFile(__dirname + "/public/login.html");
    }
    req.user = user;
    next();
  });
}
