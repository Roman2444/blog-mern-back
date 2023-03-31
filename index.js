import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

mongoose
  .connect(
    "mongodb+srv://user:wwwwww@admin.dewegae.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERROR", err));

const app = express();
app.use(express.json());

//авторизация
app.post("/auth/login", loginValidation, UserController.login);

// страница регистрации
app.post("/auth/register", registerValidation, UserController.register);

// страници обо мне
app.get("/auth/me", checkAuth, UserController.getMe);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
