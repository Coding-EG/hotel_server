import express from "express";
const router = express.Router();
import {
  CLogin,
  CRegister,
  CRegisterUser,
  CUserLogged,
  CUserDashboard,
  CHotels,
  CHotelMenu
} from "../controllers/user.js";
import { authorizeToken } from "../middlewares/authorization.js";
router.get("/login", CLogin);
router.get("/register", CRegister);
router.post("/register", CRegisterUser);
router.post("/user", CUserLogged);
router.get("/user", authorizeToken, CUserDashboard);
router.get('/hotels',authorizeToken,CHotels);
router.get('/hotels/:id',authorizeToken,CHotelMenu);
export default router;
