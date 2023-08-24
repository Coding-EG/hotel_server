import {
  MLogin,
  MRegister,
  MRegisterUser,
  MUserLogged,
  MUserDashboard,
  MHotels,
  MHotelMenu
} from "../models/user.js";
export const CLogin = (req, res) => {
  MLogin(req, res);
};
export const CRegister = (req, res) => {
  MRegister(req, res);
};
export const CRegisterUser = (req, res) => {
  MRegisterUser(req, res);
};
export const CUserLogged = (req, res) => {
  MUserLogged(req, res);
};

export const CUserDashboard = (req, res) => {
  MUserDashboard(req, res);
};

export const CHotels = (req, res) => {
  MHotels(req, res);
};

export const CHotelMenu = (req, res) => {
  MHotelMenu(req, res);
};
