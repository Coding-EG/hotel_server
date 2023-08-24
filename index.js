import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes/user.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  // console.log(__dirname);
  res.sendFile(__dirname + "/public/register.html");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
