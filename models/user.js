import "dotenv/config";
import jwt from "jsonwebtoken";
import connection from "../db/connection.js";
import { __dirname } from "../index.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

const private_key = process.env.PRIVATE_KEY;

export const MLogin = (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
};

export const MRegister = (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
};

export const MRegisterUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, userName, userEmail, userPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(userPassword, 10);

  const query = `INSERT INTO users (first_name, last_name, username, email, password, created_at) VALUES (?, ?, ?, ?, ?, NOW());`;
  connection.query(
    query,
    [firstName, lastName, userName, userEmail, hashedPassword],
    (error, results) => {
      if (error) {
        // console.error("Error during user registration:", error);
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "User Already Exists" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
      }
      // console.log("User registered successfully:", results);
      res.status(201).json({ message: "User registered successfully" });
    }
  );
};

export const MUserLogged = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { loginEmail, loginPassword } = req.body;

  const checkQuery = `SELECT * FROM users WHERE email = ?;`;
  connection.query(checkQuery, [loginEmail], (error, results) => {
    if (error) {
      // console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "User not registered" });
    }

    const user = results[0];
    const passwordMatch = bcrypt.compareSync(loginPassword, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { id: user.id, user: user.username },
        private_key,
        { expiresIn: "1h" }
      );
      // console.log("Token generated:", token);
      res.cookie("token", token, { httpOnly: true });
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ error: "Wrong password" });
    }
  });
};

export const MUserDashboard = (req, res) => {
  const { id } = req.user;

  const query = `SELECT * FROM users WHERE id = ?;`;
  connection.query(query, id, (error, results) => {
    if (error) {
      // console.error("Error retrieving user data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    res.status(200).json({
      message: `Welcome ${user.first_name} ${user.last_name}`,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
    });
  });
};

export const MHotels = (req, res) => {
  let start = parseInt(req.query.start) || 0;
  let limit = parseInt(req.query.limit) || 5;
  let offset = limit*start;
  const query = `SELECT * FROM hotels LIMIT ? OFFSET ?;`;
  connection.query(query, [limit,offset],(error, results) => {
    if (error) {
      // console.error("Error retrieving hotels data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Hotels not found" });
    }

    res.status(200).json({
      hotels: results,
    });
  });
};

export const MHotelMenu = (req, res) => {
  const hotelID = req.params.id;
  const query = `SELECT * FROM menu_items WHERE hotel_id = ?;`;
  connection.query(query, hotelID, (error, results) => {
    if (error) {
      // console.error("Error retrieving hotel menu_item:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Hotel Menu item not found" });
    }

    res.status(200).json({
      menu_items: results,
    });
  });
};
